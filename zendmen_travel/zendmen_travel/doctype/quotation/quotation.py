# Copyright (c) 2025, bjjargal@gmail.com and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class Quotation(Document):

    def before_insert(self):
        self.get_tour(self.tour)

    @frappe.whitelist()
    def get_tour(self,tour_name):
        try:
            if not self.tour:
                return
            self.attractions, self.accomodation, self.activities = [], [], []
            self.tour = tour_name
            tour = frappe.get_doc("Tour", self.tour)
            self.duration = tour.duration
            self.min_people = tour.min_people
            self.max_people = tour.max_people
            for i in tour.activities:
                self.append(
                    "activities", {"activity_name": i.activity_name, "day": i.day}
                )

            for i in tour.accomodation:
                self.append(
                    "accomodation",
                    {
                        "day": i.day,
                        "destination": i.destination,
                        "accomodation": i.accomodation,
                        "breakfast": i.breakfast,
                        "lunch": i.lunch,
                        "dinner": i.dinner,
                        "distance": i.distance,
                    },
                )
            for i in tour.attractions:
                self.append("attractions", {"attraction": i.attraction, "day": i.day})


        except:
            self.log_error("get tour error", frappe.get_traceback())
            frappe.throw("error on getting tour")
