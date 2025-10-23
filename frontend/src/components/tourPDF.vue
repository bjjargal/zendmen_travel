<template>
	<div class="min-h-screen font-sans text-gray-800">
		<!-- Header -->
		<div class="border-b pb-4">
			<img src="../assets/images/pdflogo.png" alt="Logo" class="mx-auto w-32 mb-4" />
		</div>

		<!-- Title -->
		<div class="text-center font-semibold text-2xl mt-6">
			{{ tour.doc.tour_name }}
		</div>
		<p class="text-center max-w-[700px] mx-auto mt-2 text-gray-600">
			{{ tour.doc.sub_title }}
		</p>

		<!-- Summary Grid -->
		<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 max-w-4xl mx-auto text-center">
			<div class="rounded border p-4">
				<div class="text-sm text-gray-600">Duration</div>
				<div class="text-xl mt-1 font-medium">{{ tour.doc.duration }} Days</div>
			</div>

			<div class="rounded border p-4">
				<div class="text-sm text-gray-600">Total Distance</div>
				<div class="text-xl mt-1 font-medium">{{ tour.doc.total_distance }} km</div>
			</div>

			<div class="rounded border p-4">
				<div class="text-sm text-gray-600">Group Size</div>
				<div class="text-xl mt-1 font-medium">
					{{ tour.doc.min_people }}–{{ tour.doc.max_people }} people
				</div>
			</div>

			<div class="rounded border p-4">
				<div class="text-sm text-gray-600">Difficulty</div>
				<div class="text-xl mt-1 font-medium">
					{{ tour.doc.difficulty }}
				</div>
			</div>
		</div>

		<!-- Daily Sections -->
		<div v-for="day in tour.doc.duration" :key="day" class="mt-8">
			<div v-for="(a, idx) in tour.doc.accomodation.filter((acc) => acc.day === day)" :key="idx"
				class="rounded border overflow-hidden mb-6">
				<img v-if="getDestinationImage(a.destination)" :src="getDestinationImage(a.destination)"
					alt="destination" class="h-80 w-full object-cover" />

				<div class="p-6 space-y-6">
					<!-- Day & Difficulty -->
					<div class="flex justify-between items-center">
						<div class="rounded px-3 py-1 bg-[#030213] text-white text-sm">
							Day {{ day }}
						</div>
						<div class="rounded-full text-xs bg-green-200 py-1 px-3">
							{{ a.difficulty }}
						</div>
					</div>

					<!-- Title -->
					<h2 class="text-2xl font-semibold">{{ a.title }}</h2>

					<!-- Destination Info -->
					<div v-if="a.destination" class="space-y-2">
						<div class="flex items-center gap-2 text-gray-700">
							<FeatherIcon name="map-pin" class="size-4" />
							<h3 class="font-medium">{{ a.destination }}</h3>
						</div>
						<p class="text-gray-600 text-sm leading-relaxed">
							{{ getDestinationDescription(a.destination) }}
						</p>
					</div>

					<!-- Notes -->
					<div v-if="getpdfNotes(day).length > 0" class="bg-gray-100 p-4 rounded-md space-y-2">
						<div class="flex items-center gap-2 font-medium">
							<FeatherIcon name="info" class="size-4" />
							Important Notes
						</div>
						<ul class="space-y-1 text-sm text-gray-700">
							<li v-for="notes in getpdfNotes(day)" :key="notes.name" class="flex items-start gap-2">
								<span class="text-primary">•</span>
								<span>{{ notes.note }}</span>
							</li>
						</ul>
					</div>

					<!-- Main Attractions -->
					<div v-if="getpdfAttractions(day).length" class="space-y-3">
						<h4 class="font-medium text-lg">Main Attractions</h4>
						<div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
							<div v-for="attraction in getpdfAttractions(day)" :key="attraction.attraction"
								class="bg-gray-100 px-3 py-1.5 rounded text-sm">
								{{ attraction.attraction }}
								<span class="text-gray-500 ml-1.5">
									• {{ getAttractionType(attraction.attraction) }}
								</span>
							</div>
						</div>
					</div>

					<!-- Activities -->
					<div v-if="getPdfActivities(day).length" class="space-y-3">
						<h4 class="font-medium text-lg">Activities</h4>
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<div v-for="activity in getPdfActivities(day)" :key="activity.activity_name"
								class="flex gap-3 items-start">
								<div class="flex-1">
									<div class="font-medium text-gray-800">
										{{ activity.activity_name }}
									</div>
									<div class="text-sm text-gray-600">
										{{ getActivityDescription(activity.activity_name) }}
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Travel & Logistics -->
					<div class="border-t pt-4 space-y-3">
						<h4 class="text-sm font-semibold text-gray-800">Travel & Logistics</h4>
						<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-sm">
							<div class="flex items-center gap-2">
								<FeatherIcon name="navigation" class="size-4" />
								<div>
									<div class="text-gray-500">Distance</div>
									<div>{{ a.distance }} km</div>
								</div>
							</div>

							<div class="flex items-center gap-2">
								<FeatherIcon name="clock" class="size-4" />
								<div>
									<div class="text-gray-500">Drive Time</div>
									<div>{{ a.drive_time }} hrs</div>
								</div>
							</div>

							<div class="flex items-center gap-2">
								<FeatherIcon name="map" class="size-4" />
								<div>
									<div class="text-gray-500">Terrain</div>
									<div>{{ a.terrain }}</div>
								</div>
							</div>

							<div class="flex items-center gap-2">
								<FeatherIcon name="trending-up" class="size-4" />
								<div>
									<div class="text-gray-500">Altitude</div>
									<div>{{ a.altitude }} m</div>
								</div>
							</div>

							<div class="flex items-center gap-2">
								<FeatherIcon name="home" class="size-4" />
								<div>
									<div class="text-gray-500">Accommodation</div>
									<div>{{ a.accomodation }}</div>
								</div>
							</div>

							<div v-if="getMeals(a.breakfast, a.lunch, a.dinner)" class="flex items-center gap-2">
								<FeatherIcon name="coffee" class="size-4" />
								<div>

									<div class="text-gray-500">Meals</div>
									<div>{{ getMeals(a.breakfast, a.lunch, a.dinner) }}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { DestinationStore } from "@/data/destinations";
import { ActivityStore } from "@/data/Activities";
import { ActivityDesStore } from "@/data/ActivityDestination";
import { AttractionsStore } from "../data/Attraction";
const props = defineProps({
	tour: Object,
});

const tour = props.tour;

const { destinations } = DestinationStore();
const { activities } = ActivityStore();
// const { activitiesDes } = ActivityDesStore()
const { attractions } = AttractionsStore();

const getDestinationImage = (name) => {
	const dest = destinations.data.find((d) => d.name === name);
	return dest?.image || "";
};
const getDestinationDescription = (name) => {
	const dest = destinations.data.find((d) => d.name === name);
	return dest?.description || "";
};

const getpdfNotes = (day) => {
	return tour.doc.notes?.filter((n) => n.day === day) || [];
};
const getpdfAttractions = (day) => {
	return tour.doc.attractions?.filter((n) => n.day === day) || [];
};

const getAttractionType = (name) => {
	const attraction = attractions.data.find((d) => d.name === name);
	return attraction.type;
};

const getPdfActivities = (day) => {
	return tour.doc.activities.filter((n) => n.day === day) || [];
};

const getActivityDescription = (name) => {
	const activity = activities.data.find((d) => d.name === name);
	return activity.description;
};

const getMeals = (breakfast, lunch, dinner) => {
	const meals = {
		B: breakfast,
		L: lunch,
		D: dinner,
	};

	return Object.entries(meals)
		.filter(([_, value]) => value)
		.map(([key]) => key)
		.join(", ");
};
</script>
