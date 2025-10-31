<template>
  <a-form layout="vertical">
    <a-form-item :label="label" :name="name">
      <a-table :columns="columns" :pagination="false" :data-source="filteredRows">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === mainField">
            <a-select
              v-model:value="record[mainField]"
              :options="options"
              @select="() => handleSelect(record)"
              class="!w-full"
            />
          </template>

          <template v-else-if="editableFields.includes(column.dataIndex)">
            <a-input-number
              v-model:value="record[column.dataIndex]"
              class="!w-full"
              :addon-after="columnSuffix(column.dataIndex)"
            />
          </template>

          <template v-else-if="column.dataIndex === 'Action'">
            <a-button danger size="small" @click="$emit('delete', record)">
              <FeatherIcon name="trash" class="size-4" />
            </a-button>
          </template>
        </template>
      </a-table>

      <a-button class="!mt-3" @click="$emit('add')">Add</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup>
import { computed } from "vue";
import { FeatherIcon } from "frappe-ui";

const props = defineProps({
  label: String, // "Vehicles", "Staffs", etc.
  name: String, // same as label or doctype field name
  day: Number,
  quotation: Object,
  field: String, // e.g., "vehicle", "staffs", "accomodation"
  mainField: String, // e.g., "vehicle", "staff"
  sourceData: Array, // source options like vehicles.data
  columns: Array, // column definitions
  editableFields: Array, // which fields allow number editing
  mapSelect: Function, // callback when item selected
});

const filteredRows = computed(
  () => props.quotation.doc[props.field]?.filter((i) => i.day === props.day) || []
);

const options = computed(() =>
  (props.sourceData || []).map((item) => ({
    label: item.label || item.vehicle_name || item.full_name || item.accomodation_name || item.activity_name || item.name,
    value: item.name,
  }))
);

const handleSelect = (record) => {
  if (props.mapSelect) props.mapSelect(record);
};

const columnSuffix = (col) => {
  if (col === "price") return "₮";
  if (col === "consumption") return "L";
  if (col === "distance") return "km";
  return "";
};
</script>
