<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card style="width: 1300px; max-width: 90vw; height: 650px" class="column">
      <q-card-section class="q-pa-none">
        <div class="row items-center q-px-md q-py-md" style="background-color: #f5f7fa">
          <q-avatar size="64px" class="q-mr-md">
            <img v-if="student?.photoUrl" :src="student.photoUrl" />
            <q-icon v-else name="person" size="40px" color="grey-6" />
          </q-avatar>

          <div class="col row q-col-gutter-x-xl">
            <div class="col-6 col-sm-3">
              <div class="text-caption text-grey-7">STUDENT NUMBER</div>
              <div class="text-weight-bold">{{ student?.studentNumber || "N/A" }}</div>
            </div>

            <div class="col-6 col-sm-4">
              <div class="text-caption text-grey-7">STUDENT NAME</div>
              <div class="text-weight-bold">{{ student?.name || "N/A" }}</div>
            </div>

            <div class="col-6 col-sm-3">
              <div class="text-caption text-grey-7">COLLEGE DEPARTMENT</div>
              <div class="text-weight-bold">{{ student?.college || "N/A" }}</div>
            </div>

            <div class="col-6 col-sm-2">
              <div class="text-caption text-grey-7">COURSE</div>
              <div class="text-weight-bold">{{ student?.course || "N/A" }}</div>
            </div>
          </div>

          <q-btn flat round dense icon="close" color="grey-8" @click="close" />
        </div>
      </q-card-section>

      <q-tabs
        v-model="activeTab"
        dense
        class="text-grey-8 bg-grey-1"
        active-color="blue-10"
        indicator-color="blue-10"
        align="justify"
        narrow-indicator
      >
        <q-tab name="registration" label="Registration Records" />
        <q-tab name="grades" label="Grades" />
        <q-tab name="financial" label="Financial Details" />
      </q-tabs>

      <q-separator />

      <q-tab-panels
        v-model="activeTab"
        animated
        class="q-pa-md"
        style="min-height: 320px"
      >
        <q-tab-panel name="registration">
          <q-inner-loading :showing="loading.registration">
            <q-spinner-gears size="40px" color="blue-10" />
          </q-inner-loading>

          <div
            v-if="!loading.registration && registrationRecords.length === 0"
            class="text-center text-grey-6 q-pa-lg"
          >
            No registration records found.
          </div>

          <q-list v-else bordered separator>
            <q-item v-for="(r, i) in registrationRecords" :key="i">
              <q-item-section>
                <q-item-label class="text-weight-medium"
                  >{{ r.schoolYear }} — {{ r.semester }}</q-item-label
                >
                <q-item-label caption>{{ r.courseEnrolled }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge :color="r.status === 'Enrolled' ? 'positive' : 'grey-6'">
                  {{ r.status }}
                </q-badge>
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>

        <q-tab-panel name="grades" class="q-pa-md">
          <q-inner-loading :showing="loading.grades">
            <q-spinner-gears size="40px" color="primary" />
          </q-inner-loading>

          <div v-if="!loading.grades">
            <!-- Header -->
            <div class="row items-center justify-between q-col-gutter-md q-mb-md">
              <div class="col">
                <div class="text-h6 text-primary text-weight-bold">Student Grades</div>

                <div class="text-caption text-grey-7">
                  {{ selectedSemesterLabel }}
                </div>
              </div>

              <div class="col-auto">
                <q-select
                  dense
                  outlined
                  style="width: 230px"
                  v-model="selectedSemester"
                  :options="semesters"
                  option-label="label"
                  option-value="value"
                  emit-value
                  map-options
                  label="Semester"
                >
                  <template #prepend>
                    <q-icon name="school" />
                  </template>
                </q-select>
              </div>
            </div>

            <div v-if="grades.length === 0" class="text-center text-grey-6 q-pa-xl">
              No grade records found.
            </div>

            <div v-else class="table-wrapper">
              <q-table
                flat
                bordered
                :rows="grades"
                :columns="gradeColumns"
                row-key="subjectCode"
                hide-pagination
                :rows-per-page-options="[0]"
                class="grades-table"
              >
                <!-- Subject -->

                <template #body-cell-subjectCode="props">
                  <q-td :props="props" class="subject-code">
                    {{ props.value }}
                  </q-td>
                </template>

                <!-- Description -->

                <template #body-cell-description="props">
                  <q-td :props="props">
                    <div class="description">
                      {{ props.value }}
                    </div>
                  </q-td>
                </template>

                <!-- Grade -->

                <template #body-cell-grades="props">
                  <q-td :props="props" class="text-center">
                    <q-badge color="primary" rounded class="grade-badge">
                      {{ props.value ?? "-" }}
                    </q-badge>
                  </q-td>
                </template>

                <!-- Units -->

                <template #body-cell-units="props">
                  <q-td :props="props" class="text-center">
                    {{ props.value }}
                  </q-td>
                </template>
              </q-table>
            </div>
          </div>
        </q-tab-panel>

        <q-tab-panel name="financial" class="q-pa-none">
          <q-inner-loading :showing="loading.financial">
            <q-spinner-gears size="40px" color="blue-10" />
          </q-inner-loading>

          <q-table
            v-if="!loading.financial"
            :rows="financialRecords"
            :columns="financialColumns"
            row-key="reference"
            flat
            bordered
            dense
            :rows-per-page-options="[10, 20, 50]"
            class="financial-table"
            header-class="bg-grey-2 text-grey-8 text-weight-bold text-uppercase"
          >
            <template v-slot:body-cell-debit="props">
              <q-td :props="props" class="text-right">
                {{
                  Number(props.value || 0).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })
                }}
              </q-td>
            </template>

            <template v-slot:body-cell-credit="props">
              <q-td :props="props" class="text-right">
                {{
                  Number(props.value || 0).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })
                }}
              </q-td>
            </template>

            <template v-slot:body-cell-balance="props">
              <q-td :props="props" class="text-right text-weight-bold">
                {{
                  Number(props.value || 0).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })
                }}
              </q-td>
            </template>

            <template v-slot:no-data>
              <div class="full-width column flex-center text-grey-5 q-pa-lg">
                No financial records found.
              </div>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-dialog>
</template>

<script>
import { api } from "boot/axios";

export default {
  name: "StudentDetailsDialog",

  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    student: {
      type: Object,
      default: null,
    },
  },

  emits: ["update:modelValue"],

  data() {
    return {
      activeTab: "grades",
      grades: [],
      semesters: [],
      selectedSemester: null,
      semesterOptions: [],
      financialRecords: [],
      registrationRecords: [],
      loading: {
        grades: false,
        financial: false,
        registration: false,
      },

      financialColumns: [
        {
          name: "semester",
          label: "Semester",
          field: "semester",
          align: "center",
          sortable: true,
        },
        {
          name: "tranDate",
          label: "Tran Date",
          field: "tranDate",
          align: "center",
          sortable: true,
          format: (val) =>
            val
              ? new Date(val).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                })
              : "",
        },
        {
          name: "datePosted",
          label: "Date Posted",
          field: "datePosted",
          align: "center",
          sortable: true,
          format: (val) =>
            val
              ? new Date(val).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                })
              : "",
        },
        { name: "item", label: "Item", field: "item", align: "center", sortable: true },
        {
          name: "reference",
          label: "Reference",
          field: "reference",
          align: "center",
          sortable: true,
        },
        { name: "debit", label: "Debit", field: "debit", align: "right", sortable: true },
        {
          name: "credit",
          label: "Credit",
          field: "credit",
          align: "right",
          sortable: true,
        },
        {
          name: "balance",
          label: "Balance",
          field: "balance",
          align: "right",
          sortable: true,
        },
      ],

      gradeColumns: [
        {
          name: "subjectCode",
          label: "SUBJECT CODE",
          field: "subjectCode",
          align: "left",
        },
        {
          name: "description",
          label: "DESCRIPTION",
          field: "description",
          align: "left",
        },
        {
          name: "grades",
          label: "Grade",
          field: "grades",
          align: "center",
        },
        {
          name: "units",
          label: "UNITS",
          field: "units",
          align: "center",
        },
      ],
    };
  },

  computed: {
    isOpen: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit("update:modelValue", val);
      },
    },
    selectedSemesterLabel() {
      return this.semesters.find((s) => s.value === this.selectedSemester)?.label || "";
    },
  },

  watch: {
    modelValue(val) {
      if (val && this.student) {
        this.fetchAllTabs();
      }
    },
    selectedSemester() {
      this.fetchGrades();
    },
  },

  methods: {
    close() {
      this.isOpen = false;
    },

    async fetchAllTabs() {
      this.activeTab = "grades";
      await this.fetchSemesters();

      await Promise.all([
        this.fetchGrades(),
        this.fetchFinancialRecords(),
        // this.fetchRegistrationRecords(),
      ]);
    },

    async fetchSemesters() {
      const { data } = await api.get(
        `/parent-portal/students/${this.student.studentNumber}/semesters`
      );

      this.semesters = data.data.map((s) => ({
        label: s.semester,
        value: s.semester,
      }));

      if (this.semesters.length) {
        this.selectedSemester = this.semesters[0].value;
      }
    },

    async fetchGrades() {
      this.loading.grades = true;

      try {
        const { data } = await api.get(
          `/parent-portal/students/${this.student.studentNumber}/grades`,
          {
            params: {
              semester: this.selectedSemester,
            },
          }
        );
        console.log("Grades API Response:", data);
        console.log("Grades Array:", data.data);
        this.grades = data.data;
      } catch (err) {
        console.error("fetchGrades error:", err);
      } finally {
        this.loading.grades = false;
      }
    },

    async fetchFinancialRecords() {
      this.loading.financial = true;
      try {
        const { data } = await api.get(
          `/parent-portal/students/${this.student.studentNumber}/financial`
        );
        this.financialRecords = data.data;
      } catch (err) {
        console.error("fetchFinancialRecords error:", err);
      } finally {
        this.loading.financial = false;
      }
    },

    // async fetchRegistrationRecords() {
    //   this.loading.registration = true;
    //   try {
    //     const { data } = await api.get(
    //       `/parent-portal/students/${this.student.studentNumber}/registration`
    //     );
    //     this.registrationRecords = data.data;
    //   } catch (err) {
    //     console.error("fetchRegistrationRecords error:", err);
    //   } finally {
    //     this.loading.registration = false;
    //   }
    // },
  },
};
</script>
<style scoped>
.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.grades-table {
  min-width: 750px;
}

.grades-table thead {
  background: #f5f7fa;
}

.grades-table th {
  font-weight: 700;
  font-size: 13px;
  color: #1f2937;
}

.grades-table td {
  vertical-align: top;
}

.subject-code {
  white-space: nowrap;
  font-weight: 600;
  color: #0d47a1;
}

.description {
  white-space: normal;
  word-break: break-word;
  line-height: 1.45;
  min-width: 300px;
  max-width: 420px;
}

.grade-badge {
  min-width: 50px;
  justify-content: center;
  font-weight: 700;
}

.grades-table tbody tr:hover {
  background: #f6fbff;
}

@media (max-width: 900px) {
  .description {
    min-width: 220px;
    max-width: 260px;
  }
}

@media (max-width: 600px) {
  .grades-table {
    min-width: 650px;
  }
}
</style>
