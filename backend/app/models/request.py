"""
Guarded Enquiry Service - Request Models
Defines validated input payloads with strict length, character, and format constraints.
"""

from typing import Optional
from pydantic import BaseModel, Field, field_validator

class AskRequest(BaseModel):
    """Payload for user question query."""
    question: str = Field(
        ...,
        min_length=3,
        max_length=500,
        description="The enquiry submitted by a parent or student."
    )
    session_id: Optional[str] = Field(
        default=None,
        max_length=64,
        description="Optional client session identifier for tracking conversation turns."
    )
    client_language: Optional[str] = Field(
        default="en",
        max_length=10,
        description="Optional client language hint (e.g., 'en', 'hi')."
    )

    @field_validator("question")
    @classmethod
    def validate_question(cls, v: str) -> str:
        cleaned = v.strip()
        if len(cleaned) < 3:
            raise ValueError("Question must contain at least 3 non-whitespace characters.")
        if len(cleaned) > 500:
            raise ValueError("Question exceeds maximum permissible length of 500 characters.")
        # Check that it has at least some alphanumeric content
        if not any(c.isalnum() for c in cleaned):
            raise ValueError("Question must contain valid alphanumeric words.")
        return cleaned

class HandoffResolveRequest(BaseModel):
    """Payload for staff resolving or reviewing an escalated query."""
    resolution_status: str = Field(..., pattern="^(REVIEWED|RESOLVED|DISMISSED)$")
    reviewer_notes: Optional[str] = Field(default=None, max_length=500)
