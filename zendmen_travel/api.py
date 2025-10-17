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


@frappe.whitelist()
def get_destination_activities():
    data = frappe.db.sql(
        """SELECT destination, parent from `tabDestination Child` group by parent """,
        as_dict=True,
    )
    ret = {}
    for i in data:
        if i.destination in ret:
            ret[i.destination].append(i.parent)
        else:
            ret[i.destination] = [i.parent]
    return ret
