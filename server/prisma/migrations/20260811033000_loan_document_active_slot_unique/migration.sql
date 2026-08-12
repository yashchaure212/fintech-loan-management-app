-- One active (non-rejected) document per application slot.
-- Rejected rows may coexist briefly during replacement uploads.
CREATE UNIQUE INDEX "loan_documents_active_slot_key"
ON "loan_documents" ("loanApplicationId", "ownerType", "documentType")
WHERE "status" <> 'REJECTED';
