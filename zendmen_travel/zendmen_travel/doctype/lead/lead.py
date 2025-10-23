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
        # self.create_contact()

    @frappe.whitelist()
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
            self.save()
        except:
            self.log_error("create contact error", frappe.get_traceback())

    @frappe.whitelist()
    def create_opportunity(self, assignee=None, deadline=None, other_information=None):
        try:
            opportunity = frappe.new_doc("Opportunity")
            opportunity.customer = self.customer
            opportunity.email = self.email
            opportunity.company_name = self.company_name
            opportunity.country = self.country
            opportunity.whatsapp = self.whatsapp
            opportunity.contact = self.contact
            opportunity.image = self.image
            opportunity.assigned = assignee
            opportunity.deadline = deadline
            opportunity.lead = self.name
            opportunity.age = self.age
            opportunity.group_min = self.group_min
            opportunity.group_max = self.group_max
            opportunity.comfort_type = self.comfort_type
            opportunity.season = self.season
            opportunity.duration = self.duration
            opportunity.nationality = self.nationality
            opportunity.group_type = self.group_type
            opportunity.interest = self.interest
            opportunity.note = self.note
            opportunity.follow_up_requests = self.follow_up_requests
            opportunity.other_information = other_information
            for i in self.year:
                opportunity.append("year", {"year": i.year, "checked": i.checked})
            opportunity.insert()
            return
        except:
            self.log_error("Create opportunity error", frappe.get_traceback())
            frappe.throw("Create opportunity error")
