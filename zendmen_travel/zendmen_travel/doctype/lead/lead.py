# Copyright (c) 2025, bjjargal@gmail.com and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import now_datetime


class Lead(Document):

    def before_insert(self):
        self.year = []
        now_year = int(now_datetime().year)
        for i in range(3):
            self.append("year", {"year": now_year + (i + 1)})
        self.create_contact()

    def create_contact(self):
        try:
            contact = frappe.new_doc("Lead Contacts")
            contact.contact_name = self.customer
            contact.company_name = self.company_name
            contact.email = self.email
            contact.whatsapp = self.whatsapp
            contact.country = self.country
            contact.insert()
            self.contact = contact.name
        except:
            self.log_error("create contact error", frappe.get_traceback())
