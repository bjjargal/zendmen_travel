# Copyright (c) 2025, bjjargal@gmail.com and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class Employee(Document):
    def before_insert(self):
        self.create_user()

    def create_user(self):
        try:
            if not self.email:
                frappe.throw("Email must be set")
            user_dict = {
                "email": self.email,
                "first_name": self.first_name,
                "last_name": self.last_name,
                "send_welcome_email": 0,
                "mobile_no": self.phone,
            }
            user = frappe.new_doc("User")
            user.update(user_dict)
            user.insert()
            self.user = user.name
        except:
            self.log_error("create user error", frappe.get_traceback())
            frappe.throw("Error on creating user")
