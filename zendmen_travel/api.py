import frappe


@frappe.whitelist()
def get_logged_user():
    try:
        roles = frappe.get_roles()
        return {
            "user": frappe.session.user,
            "roles": roles,
        }
    except:
        return
