try:
    from backend.services.tools.maintenance_tool import (
        CATEGORIES,
        MAINTENANCE_TEAMS,
        MAINTENANCE_TICKETS,
        classify_priority,
        assign_technician,
        create_maintenance_ticket,
        update_ticket_status
    )
except ImportError:
    from services.tools.maintenance_tool import (
        CATEGORIES,
        MAINTENANCE_TEAMS,
        MAINTENANCE_TICKETS,
        classify_priority,
        assign_technician,
        create_maintenance_ticket,
        update_ticket_status
    )
