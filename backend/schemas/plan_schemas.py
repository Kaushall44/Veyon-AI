from pydantic import BaseModel, Field
from typing import Optional, List

class ActionStep(BaseModel):
    step_number: int = Field(..., example=1)
    title: str = Field(..., example="Check Prerequisites")
    description: str = Field(..., example="Verify student passed CS301 prerequisite course.")
    status: str = Field(..., example="PASSED") # PASSED, CHECKED, PENDING_APPROVAL, IN_PROGRESS, COMPLETED
    assigned_actor: str = Field(..., example="System Auto-Check")

class ActionPlan(BaseModel):
    intent: str = Field(..., example="LAB_BOOKING")
    risk_level: str = Field(..., example="HIGH") # LOW, MEDIUM, HIGH
    requires_approval: bool = Field(True, example=True)
    assigned_approver_role: Optional[str] = Field(None, example="Lab_In_Charge")
    summary: str = Field(..., example="Multi-step execution plan for Advanced AI Lab reservation.")
    steps: List[ActionStep]
