<template>
  <q-page class="q-pa-md bg-grey-4 q-py-md">
    <q-card class="no-shadow" style="border: 1px solid #e0e0e0">
      <!-- <q-card-section class="q-py-md q-px-lg" style="background-color: #004aad">
        <div class="text-h6 text-white text-weight-bold">MY STUDENTS</div>
        <div class="text-caption text-grey-5">Search your linked students</div>
      </q-card-section> -->

      <q-card-section class="q-py-md q-px-lg bg-grey-1">
        <q-table
          bordered
          :rows="students"
          :columns="columns"
          row-key="id"
          :loading="loading"
          :filter="searchQuery"
          flat
          virtual-scroll
          :rows-per-page-options="[10]"
          class="clean-table fit"
          header-class="bg-grey-7 text-grey-8 text-weight-bold text-uppercase"
          @row-click="(evt, row) => openDetails(row)"
        >
          <template v-slot:body-cell-name="props">
            <q-td :props="props">
              <div class="text-weight-medium">
                {{ props.value }}
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-studentNumber="props">
            <q-td :props="props">
              <span class="text-weight-bold text-grey-8">
                {{ props.value || "N/A" }}
              </span>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="text-center">
              <q-btn flat round color="grey-7" icon="more_vert" @click.stop>
                <q-menu cover auto-close>
                  <q-list style="min-width: 150px">
                    <q-item clickable>
                      <q-item-section avatar>
                        <q-icon name="visibility" color="blue-8" />
                      </q-item-section>
                      <q-item-section>View Details</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </q-td>
          </template>

          <template v-slot:loading>
            <q-inner-loading showing>
              <q-spinner-gears size="50px" color="blue-10" />
            </q-inner-loading>
          </template>

          <template v-slot:no-data>
            <div class="full-width column flex-center text-grey-5 q-pa-xl">
              <q-icon size="4em" name="person_search" class="q-mb-md" />
              <div class="text-subtitle1">
                {{
                  searchQuery
                    ? `No students found matching "${searchQuery}"`
                    : "No students linked yet"
                }}
              </div>
            </div>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <StudentDetailsDialog v-model="detailsDialogOpen" :student="selectedStudent" />
  </q-page>
</template>

<script>
import StudentDetailsDialog from "components/StudentDetailsDialog.vue";

export default {
  name: "StudentList",

  components: { StudentDetailsDialog },

  data() {
    return {
      searchQuery: "",
      loading: false,
      students: [],
      detailsDialogOpen: false,
      selectedStudent: null,
      columns: [
        {
          name: "studentNumber",
          label: "STUDENT NUMBER",
          field: "studentNumber",
          align: "center",
          sortable: true,
        },
        {
          name: "name",
          label: "NAME",
          field: "name",
          align: "center",
          sortable: true,
        },
        {
          name: "college",
          label: "COLLEGE / DEPARTMENT",
          field: "college",
          align: "center",
          sortable: true,
        },
        {
          name: "course",
          label: "COURSE",
          field: "course",
          align: "center",
          sortable: true,
        },
      ],
    };
  },

  methods: {
    handleSearch() {},

    openDetails(student) {
      this.selectedStudent = student;
      this.detailsDialogOpen = true;
    },

    async fetchStudents() {
      this.loading = true;
      try {
        const { data } = await this.$api.get("/parent-portal/students");
        this.students = data.data;
      } catch (err) {
        console.error("fetchStudents error:", err);
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.fetchStudents();
    console.log(process.env);
  },
};
</script>

<style scoped>
.clean-table :deep(.q-table__top),
.clean-table :deep(.q-table__bottom),
.clean-table :deep(thead tr:first-child th) {
  border-bottom: 1px solid #f0f0f0;
}

.clean-table :deep(thead tr th) {
  position: sticky;
  z-index: 1;
  background-color: #f8f9fa;
}

.clean-table :deep(tbody tr:hover) {
  background: #fafafa !important;
  cursor: pointer;
}

.clean-table :deep(td),
.clean-table :deep(th) {
  border-bottom: 1px solid #f5f5f5;
}
</style>
