import { AppError, ErrorCode } from "../../../common/errors/app.error";
import { FinancialDraftRepository } from "../repositories/financial.draft.repository";

export class FsDraftService {
  constructor(private readonly draftRepo: FinancialDraftRepository) {}

  async acceptProposal(proposalId: string, userId: string): Promise<void> {
    const proposal = await this.draftRepo.findProposalWithUserId(proposalId);

    if (!proposal) throw AppError.fromCode(ErrorCode.NOT_FOUND);
    if (proposal.user_id !== userId) {
      throw new AppError(ErrorCode.FORBIDDEN, "접근 권한이 없습니다.");
    }
    if (proposal.status !== "PENDING") {
      throw new AppError(ErrorCode.CONFLICT, "이미 처리된 proposal입니다.");
    }

    await this.draftRepo.replaceDraft(
      proposal.financial_statement_draft_id,
      proposal.new_value,
    );

    await this.draftRepo.updateProposalStatus(proposalId, "ACCEPTED");
  }

  async rejectProposal(proposalId: string, userId: string): Promise<void> {
    const proposal = await this.draftRepo.findProposalWithUserId(proposalId);

    if (!proposal) throw AppError.fromCode(ErrorCode.NOT_FOUND);
    if (proposal.user_id !== userId) {
      throw new AppError(ErrorCode.FORBIDDEN, "접근 권한이 없습니다.");
    }
    if (proposal.status !== "PENDING") {
      throw new AppError(ErrorCode.CONFLICT, "이미 처리된 proposal입니다.");
    }

    await this.draftRepo.updateProposalStatus(proposalId, "REJECTED");
  }

  async getPendingProposals(draftId: string) {
    // draft → chat_room → user_id 로 권한 검증
    const draft = await this.draftRepo.findDraftById(draftId);

    if (!draft) throw AppError.fromCode(ErrorCode.NOT_FOUND);

    // draft에 user_id 없으므로 chat_room 통해 검증은 service 상위에서 roomId 넘기거나
    // 아래처럼 별도 조인 쿼리 활용 가능 - 여기선 roomId 기반 접근 권장
    const proposals =
      await this.draftRepo.findPendingProposalsByDraftId(draftId);

    return proposals.map((p) => ({
      id: p.id,
      fieldName: p.field_name,
      oldValue: p.old_value,
      newValue: p.new_value,
      reason: p.reason,
      status: p.status,
      createdAt: new Date(p.created_at),
    }));
  }
}
