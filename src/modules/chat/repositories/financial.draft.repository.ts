import { Pool } from "pg";
import { FinancialStatementDraftRow } from "../types/entity/financial-draft.entity";
import {
  FinancialDraftChangeProposalRow,
  FinancialStatementDraft,
} from "../types/entity/financial-draft-change-proposal.entity";
import { ExpenseItem } from "../../financial/types/entity/financial-statement.entity";
import { IFinancialDraftRepository } from "../contracts/repositories/financial.draft.repository";

export class FinancialDraftRepository implements IFinancialDraftRepository {
  constructor(private readonly db: Pool) {}

  // ─── Draft ───────────────────────────────────────────

  async replaceDraft(
    draftId: string,
    snapshot: FinancialStatementDraft,
  ): Promise<void> {
    await this.db.query(
      `
    UPDATE financial_statement_drafts
    SET
      net_monthly_income = $1,
      monthly_fixed_expenses = $2,
      monthly_savings_investment = $3,
      updated_at = NOW()
    WHERE id = $4
    `,
      [
        snapshot.netMonthlyIncome,
        snapshot.monthlyFixedExpenses,
        snapshot.monthlySavingsInvestment,
        draftId,
      ],
    );
  }

  async findActiveDraftByRoomId(
    roomId: string,
  ): Promise<FinancialStatementDraftRow | null> {
    const result = await this.db.query<FinancialStatementDraftRow>(
      `SELECT * FROM financial_statement_drafts
       WHERE financial_statement_chat_room_id = $1
         AND status = 'ACTIVE'
       LIMIT 1`,
      [roomId],
    );
    return result.rows[0] ?? null;
  }

  async findProposalByDraftId(
    draftId: string,
  ): Promise<FinancialDraftChangeProposalRow | null> {
    const result = await this.db.query<FinancialDraftChangeProposalRow>(
      `SELECT * FROM financial_draft_change_proposals
     WHERE financial_statement_draft_id = $1
     LIMIT 1`,
      [draftId],
    );

    return result.rows[0] ?? null;
  }

  async findDraftById(
    draftId: string,
  ): Promise<FinancialStatementDraftRow | null> {
    const result = await this.db.query<FinancialStatementDraftRow>(
      `SELECT * FROM financial_statement_drafts WHERE id = $1`,
      [draftId],
    );
    return result.rows[0] ?? null;
  }

  async createDraft(input: {
    id: string;
    financialStatementId: string;
    financialStatementChatRoomId: string;
    netMonthlyIncome: number | null;
    monthlyFixedExpenses: ExpenseItem[] | null;
    monthlySavingsInvestment: ExpenseItem[] | null;
  }): Promise<void> {
    await this.db.query(
      `INSERT INTO financial_statement_drafts
         (id, financial_statement_id, financial_statement_chat_room_id,
          net_monthly_income, monthly_fixed_expenses, monthly_savings_investment, status,
          created_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'ACTIVE', NOW())`,
      [
        input.id,
        input.financialStatementId,
        input.financialStatementChatRoomId,
        input.netMonthlyIncome,
        input.monthlyFixedExpenses, // jsonb: 객체 그대로
        input.monthlySavingsInvestment,
      ],
    );
  }

  async updateDraftStatus(
    draftId: string,
    status: "ACTIVE" | "COMPLETED" | "DISCARDED",
  ): Promise<void> {
    await this.db.query(
      `UPDATE financial_statement_drafts
       SET status = $1, updated_at = NOW()
       WHERE id = $2`,
      [status, draftId],
    );
  }

  async updateDraftField(
    draftId: string,
    fieldName: string,
    newValue: ExpenseItem[] | number,
  ): Promise<void> {
    const ALLOWED_FIELDS = [
      "net_monthly_income",
      "monthly_fixed_expenses",
      "monthly_savings_investment",
    ];

    if (!ALLOWED_FIELDS.includes(fieldName)) {
      throw new Error(`허용되지 않는 필드입니다: ${fieldName}`);
    }

    await this.db.query(
      `UPDATE financial_statement_drafts
       SET ${fieldName} = $1, updated_at = NOW()
       WHERE id = $2`,
      [newValue, draftId],
    );
  }

  async deleteDraft(draftId: string): Promise<void> {
    await this.db.query(
      `DELETE FROM financial_statement_drafts WHERE id = $1`,
      [draftId],
    );
  }

  // ─── Proposal ────────────────────────────────────────

  async hasPendingProposal(draftId: string): Promise<boolean> {
    const result = await this.db.query<{ exists: boolean }>(
      `SELECT EXISTS (
         SELECT 1 FROM financial_draft_change_proposals
         WHERE financial_statement_draft_id = $1
           AND status = 'PENDING'
       ) AS exists`,
      [draftId],
    );
    return result.rows[0].exists;
  }

  async createProposal(input: {
    id: string;
    financialStatementDraftId: string;
    fieldName: string;
    oldValue: FinancialStatementDraft;
    newValue: FinancialStatementDraft;
    reason: string | null;
  }): Promise<void> {
    await this.db.query(
      `INSERT INTO financial_draft_change_proposals
         (id, financial_statement_draft_id, field_name, old_value, new_value, reason, status,
          created_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'PENDING', NOW())`,
      [
        input.id,
        input.financialStatementDraftId,
        input.fieldName,
        input.oldValue,
        input.newValue,
        input.reason,
      ],
    );
  }

  async findProposalById(
    proposalId: string,
  ): Promise<FinancialDraftChangeProposalRow | null> {
    const result = await this.db.query<FinancialDraftChangeProposalRow>(
      `SELECT * FROM financial_draft_change_proposals WHERE id = $1`,
      [proposalId],
    );
    return result.rows[0] ?? null;
  }

  /**
   * proposal → draft → chat_room 조인으로 user_id 함께 반환
   * (draft, proposals 둘 다 user_id 컬럼 없으므로 권한 검증용)
   */
  async findProposalWithUserId(
    proposalId: string,
  ): Promise<(FinancialDraftChangeProposalRow & { user_id: string }) | null> {
    const result = await this.db.query<
      FinancialDraftChangeProposalRow & { user_id: string }
    >(
      `SELECT p.*, r.user_id
       FROM financial_draft_change_proposals p
       JOIN financial_statement_drafts d
         ON d.id = p.financial_statement_draft_id
       JOIN financial_statement_chat_rooms r
         ON r.id = d.financial_statement_chat_room_id
       WHERE p.id = $1`,
      [proposalId],
    );
    return result.rows[0] ?? null;
  }

  async updateProposalStatus(
    proposalId: string,
    status: "ACCEPTED" | "REJECTED",
  ): Promise<void> {
    await this.db.query(
      `UPDATE financial_draft_change_proposals
       SET status = $1, updated_at = NOW()
       WHERE id = $2`,
      [status, proposalId],
    );
  }

  async findPendingProposalsByDraftId(
    draftId: string,
  ): Promise<FinancialDraftChangeProposalRow[]> {
    const result = await this.db.query<FinancialDraftChangeProposalRow>(
      `SELECT * FROM financial_draft_change_proposals
       WHERE financial_statement_draft_id = $1
         AND status = 'PENDING'
       ORDER BY created_at ASC`,
      [draftId],
    );
    return result.rows;
  }
}
