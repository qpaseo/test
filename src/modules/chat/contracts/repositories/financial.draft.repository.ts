import { ExpenseItem } from "../../../financial/types/entity/financial-statement.entity";
import {
  FinancialDraftChangeProposalRow,
  FinancialStatementDraft,
} from "../../types/entity/financial-draft-change-proposal.entity";
import { FinancialStatementDraftRow } from "../../types/entity/financial-draft.entity";

export interface IFinancialDraftRepository {
  // ─── Draft ───────────────────────────────────────────

  replaceDraft(
    draftId: string,
    snapshot: FinancialStatementDraft,
  ): Promise<void>;

  findActiveDraftByRoomId(
    roomId: string,
  ): Promise<FinancialStatementDraftRow | null>;

  findDraftById(draftId: string): Promise<FinancialStatementDraftRow | null>;

  createDraft(input: {
    id: string;
    financialStatementId: string;
    financialStatementChatRoomId: string;
    netMonthlyIncome: number | null;
    monthlyFixedExpenses: ExpenseItem[] | null;
    monthlySavingsInvestment: ExpenseItem[] | null;
  }): Promise<void>;

  updateDraftStatus(
    draftId: string,
    status: "ACTIVE" | "COMPLETED" | "DISCARDED",
  ): Promise<void>;

  updateDraftField(
    draftId: string,
    fieldName: string,
    newValue: ExpenseItem[] | number,
  ): Promise<void>;

  deleteDraft(draftId: string): Promise<void>;

  // ─── Proposal ────────────────────────────────────────

  hasPendingProposal(draftId: string): Promise<boolean>;

  createProposal(input: {
    id: string;
    financialStatementDraftId: string;
    fieldName: string;
    oldValue: FinancialStatementDraft;
    newValue: FinancialStatementDraft;
    reason: string | null;
  }): Promise<void>;

  findProposalById(
    proposalId: string,
  ): Promise<FinancialDraftChangeProposalRow | null>;

  findProposalByDraftId(
    draftId: string,
  ): Promise<FinancialDraftChangeProposalRow | null>;

  findProposalWithUserId(
    proposalId: string,
  ): Promise<(FinancialDraftChangeProposalRow & { user_id: string }) | null>;

  updateProposalStatus(
    proposalId: string,
    status: "ACCEPTED" | "REJECTED",
  ): Promise<void>;

  findPendingProposalsByDraftId(
    draftId: string,
  ): Promise<FinancialDraftChangeProposalRow[]>;
}
