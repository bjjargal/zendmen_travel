<template>
    <div class="min-h-screen bg-background  font-sans">
        <div class="border-b">
            <!-- <img src="../assets/images/pdflogo.png" alt=""> -->
            <img src="../assets/images/pdflogo.png" alt="Logo" class="mx-auto w-32 mb-6" />
        </div>
        <div class="text-center  font-semibold    text-2xl mt-6">
            {{ tour.doc.tour_name }}
        </div>
        <p class="text-center w-[700px] mx-auto mt-2 text-gray-600">
            {{ tour.doc.sub_title }}
        </p>
        <div class="grid grid-cols-4 gap-4">
            <div class="rounded border text-center p-4">
                <div class="text-sm text-gray-600">Duration</div>
                <div class="text-xl mt-2">{{ tour.doc.duration }} Days</div>

            </div>
            <div class="rounded border text-center p-4">
                <div class="text-sm text-gray-600">Total Distance</div>
                <div class="text-xl mt-2">{{ tour.doc.total_distance }} km</div>
            </div>
            <div class="rounded border text-center p-4">
                <div class="text-sm text-gray-600">Group Size</div>
                <div class="text-xl mt-2">{{ tour.doc.min_people }}-{{ tour.doc.max_people }} people</div>
            </div>
            <div class="rounded border text-center p-4">
                <div class="text-sm text-gray-600">Difficulty</div>
                <div class="text-xl mt-2">{{ tour.doc.difficulty }}</div>
            </div>
        </div>
        <div v-for="day in tour.doc.duration">
            <div v-for="(a, idx) in tour.doc.accomodation.filter(acc => acc.day === day)" :key="idx"
                class="rounded mt-6 overflow-hidden border">
                <img v-if="getDestinationImage(a.destination)" :src="getDestinationImage(a.destination)" alt=""
                    class="h-80 w-full object-cover">
                <div class="p-6 mt-2 space-y-6">
                    <div class="flex justify-between items-center">
                        <div class=" rounded p-2 bg-[#030213] text-white  leading-none !m-0">
                            Day {{ day }}
                        </div>
                        <div class="rounded-full text-sm bg-green-200 py-1 px-3">
                            {{ a.difficulty }}
                        </div>
                    </div>
                    <h2 class="text-2xl">{{ a.title }}</h2>
                    <div v-if="a.destination" class="space-y-3">
                        <div class="flex items-center gap-2 ">
                            <FeatherIcon name="map-pin" class="size-4" />
                            <h3 class=" !m-0">{{ a.destination }}</h3>
                        </div>
                        <p class="  text-gray-700">
                            {{ getDestinationDescription(a.destination) }}
                        </p>
                    </div>
                    <div v-if="getpdfNotes(day).length > 0" class="bg-gray-200 p-4 rounded-lg space-y-2">
                        <div class="flex items-center gap-2">
                            <FeatherIcon name="info" class="size-4" />
                            <h4 class="text-sm m-0">Important Notes</h4>
                        </div>
                        <ul class="space-y-1 text-sm text-muted-foreground">

                            <li v-for="notes in getpdfNotes(day)" class="flex items-center gap-2">
                                <span class="text-primary mt-1">•</span>
                                <span>{{ notes.note }}</span>
                            </li>

                        </ul>
                    </div>
                    <div className="space-y-3">
                        <h4>Main Attractions</h4>
                        <div className="grid grid-cols-3 gap-2">
                            <div v-for="attraction in getpdfAttractions(day)" class="bg-gray-200 px-3 py-1.5 rounded ">
                                {{ attraction.attraction }}
                                <span class="text-gray-600 ml-1.5">
                                    • {{ getAttractionType(attraction.attraction) }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="space-y-3">
                        <h4>Activities</h4>
                        <div class="grid grid-cols-2 gap-3">
                            <div v-for="activity in getPdfActivities(day)" class="flex gap-3 items-start">
                                <div class="flex-1">
                                    <div class="font-medium">{{ activity.activity_name }}</div>
                                    <div class="text-sm text-gray-600">
                                        {{ getActivityDescription(activity.activity_name) }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="border-t space-y-4 pt-4 ">
                        <h4 class="text-sm">Travel & Logistics</h4>
                        <div class="flex gap-4 justify-between">
                            <div className="flex  items-center gap-2">
                                <FeatherIcon name="navigation" class="size-4" />
                                <div className="min-w-0">
                                    <div className="text-sm text-gray-600">Distance</div>
                                    <div className=" truncate">{{ a.distance }} km</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <FeatherIcon name="clock" class="size-4" />
                                <div className="min-w-0">
                                    <div className="text-sm text-gray-600">Drive Time</div>
                                    <div className=" truncate">{{ a.drive_time }} min</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <FeatherIcon name="map" class="size-4" />
                                <div className="min-w-0">
                                    <div className="text-sm text-gray-600">Terrain</div>
                                    <div className=" truncate">{{ a.terrain }}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <FeatherIcon name="trending-up" class="size-4" />
                                <div className="min-w-0">
                                    <div className="text-sm text-gray-600">Altitude</div>
                                    <div className=" truncate">{{ a.aButtonltitude }} km</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <FeatherIcon name="home" class="size-4" />
                                <div className="min-w-0">
                                    <div className="text-sm text-gray-600">Accommodation</div>
                                    <div className=" truncate">{{ a.accomodation }}</div>
                                </div>
                            </div>
                            <div v-if="getMeals(a.breakfast, a.lunch, a.dinner)" className="flex items-center gap-2">
                                <FeatherIcon name="coffee" class="size-4" />
                                <div className="min-w-0">
                                    <div className="text-sm text-gray-600">Meals</div>
                                    <div className=" truncate">{{ getMeals(a.breakfast, a.lunch, a.dinner) }}</div>
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
import { DestinationStore } from '@/data/destinations';
import { ActivityStore } from '@/data/Activities';
import { ActivityDesStore } from '@/data/ActivityDestination';
import { AttractionsStore } from '../data/Attraction';
const props = defineProps({
    tour: Object,

})

const tour = props.tour

const { destinations } = DestinationStore();
const { activities } = ActivityStore()
// const { activitiesDes } = ActivityDesStore()
const { attractions } = AttractionsStore()

const getDestinationImage = (name) => {
    const dest = destinations.data.find(d => d.name === name)
    return dest?.image || ""
}
const getDestinationDescription = (name) => {
    const dest = destinations.data.find(d => d.name === name)
    return dest?.description || ""
}


const getpdfNotes = (day) => {
    return tour.doc.notes?.filter(n => n.day === day) || []
}
const getpdfAttractions = (day) => {
    return tour.doc.attractions?.filter(n => n.day === day) || []
}

const getAttractionType = (name) => {
    const attraction = attractions.data.find(d => d.name === name)
    return attraction.type
}

const getPdfActivities = (day) => {
    return tour.doc.activities.filter(n => n.day === day) || []
}

const getActivityDescription = (name) => {
    const activity = activities.data.find(d => d.name === name)
    return activity.description
}

const getMeals = (breakfast, lunch, dinner) => {
    const meals = {
        B: breakfast,
        L: lunch,
        D: dinner
    }

    return Object.entries(meals)
        .filter(([_, value]) => value)
        .map(([key]) => key)
        .join(', ')
}
</script>


