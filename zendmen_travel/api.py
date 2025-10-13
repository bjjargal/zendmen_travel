import frappe


@frappe.whitelist(allow_guest=True)
def get_logged_user():
    try:
        roles = frappe.get_roles()
        return {
            "user": frappe.session.user,
            "roles": roles,
        }
    except:
        return


@frappe.whitelist()
def get_destination():
    try:
        data = frappe.db.get_list("Destination", ["name", "destination_name"])
        return data
    except:
        return
