try:
    from backend.services.tools.grievance_tool import (
        GRIEVANCE_CATEGORIES,
        GRIEVANCE_RECORDS,
        mask_identity_if_needed,
        create_grievance,
        get_grievance_by_token,
        check_and_escalate_sla,
        resolve_grievance,
        get_sanitized_grievance_queue
    )
except ImportError:
    from services.tools.grievance_tool import (
        GRIEVANCE_CATEGORIES,
        GRIEVANCE_RECORDS,
        mask_identity_if_needed,
        create_grievance,
        get_grievance_by_token,
        check_and_escalate_sla,
        resolve_grievance,
        get_sanitized_grievance_queue
    )
