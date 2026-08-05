<template>
  <div class="q-mt-sm">
    <div
      v-for="(student, index) in students"
      :key="index"
      class="student-box q-mb-md q-pa-md"
    >
      <div class="row items-center justify-between q-mb-sm">
        <div class="text-subtitle2 text-grey-8">Student {{ index + 1 }}</div>
        <q-btn
          flat
          round
          dense
          size="sm"
          icon="delete"
          color="negative"
          @click="removeStudent(index)"
          :disable="students.length === 1"
        />
      </div>

      <div class="row q-col-gutter-md items-start">
        <div class="col-12 col-sm-4">
          <q-input
            outlined
            dense
            v-model="student.number"
            label="Student Number"
            :loading="student.lookupLoading"
            @keyup.enter="lookupStudent(index)"
          >
            <template #append>
              <q-icon
                name="search"
                class="cursor-pointer"
                @click="lookupStudent(index)"
              />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-sm-4">
          <q-input outlined dense readonly v-model="student.fullName" label="Full Name" />
        </div>
        <div class="col-12 col-sm-4">
          <q-input
            outlined
            dense
            readonly
            v-model="student.birthDate"
            label="Birth Date"
            type="date"
            stack-label
          />
        </div>
        <div class="col-12 col-sm-4">
          <q-input outlined dense readonly v-model="student.college" label="College" />
        </div>
        <div class="col-12 col-sm-4">
          <q-input outlined readonly dense v-model="student.course" label="Course" />
        </div>

        <!-- <div class="col-12 col-sm-4">
          <template v-if="student.isExisting && student.photoUrl">
            <div class="text-caption text-grey-8 q-mb-xs">Photo</div>
            <q-img
              :src="student.photoUrl"
              style="max-width: 120px; border-radius: 4px"
              fit="contain"
            />
            <q-btn
              flat
              dense
              size="sm"
              color="primary"
              label="Replace photo"
              class="q-mt-xs"
              @click="student.isExisting = false"
            />
          </template>

          <q-file
            v-else
            outlined
            dense
            v-model="student.photo"
            label="Upload Photo"
            accept=".jpg, .jpeg, .png"
            max-file-size="5242880"
            @rejected="onFileRejected"
            @update:model-value="(file) => onFileSelected(file, index)"
          >
            <template #prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
        </div> -->
        <div class="col-12 col-sm-4">
          <template v-if="student.isExisting && student.photoUrl">
            <div class="text-caption text-center text-grey-8 q-mb-xs">Photo</div>
            <q-img :src="student.photoUrl" class="student-photo" fit="contain" />
          </template>

          <q-file
            v-else
            outlined
            dense
            v-model="student.photo"
            label="Upload Photo"
            accept=".jpg, .jpeg, .png"
            max-file-size="5242880"
            @rejected="onFileRejected"
            @update:model-value="(file) => onFileSelected(file, index)"
          >
            <template #prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
        </div>
      </div>
    </div>

    <q-btn
      flat
      color="primary"
      icon="add"
      label="Add Another Student"
      @click="addStudent"
      class="q-mb-md text-center"
    />

    <div class="row justify-center q-gutter-md q-mt-md">
      <q-btn
        unelevated
        color="primary"
        label="Back"
        icon="arrow_back"
        @click="$emit('prev')"
      />
      <q-btn
        unelevated
        color="accent"
        label="Continue"
        text-color="dark"
        icon-right="arrow_forward"
        @click="onNext"
      />
    </div>
  </div>
</template>

<script>
import { api } from "boot/axios";

const emptyStudent = () => ({
  number: "",
  fullName: "",
  birthDate: "",
  college: "",
  course: "",
  photo: null,
  photoUrl: null,
  isExisting: false,
  lookupLoading: false,
});

export default {
  name: "ParentAddStudents",

  props: {
    prefillStudents: { type: Array, default: () => [] },
  },

  emits: ["prev", "next"],

  data() {
    return {
      students:
        this.prefillStudents.length > 0
          ? this.prefillStudents.map((s) => ({ ...emptyStudent(), ...s }))
          : [emptyStudent()],
    };
  },

  methods: {
    async lookupStudent(index) {
      const student = this.students[index];
      const number = student.number?.trim();

      if (!number) {
        this.$q.notify({
          type: "warning",
          position: "top",
          message: "Please enter a student number first.",
        });
        return;
      }

      student.lookupLoading = true;

      try {
        const { data } = await api.get(
          `http://10.107.0.2:3000/parent-portal/students/${encodeURIComponent(number)}`
        );

        if (!data || !data.success || !data.data) {
          this.clearFields(student);
          this.$q.notify({
            type: "negative",
            position: "top",
            message: "No student found with that number.",
          });
          return;
        }

        const record = data.data;

        student.fullName = record.fullName ?? record.studentName ?? "";
        // student.birthDate = record.birthDate ?? "";
        student.college = record.college ?? "";
        student.course = record.course ?? "";
        student.photoUrl = record.photoUrl ?? record.pictureImage ?? null;
        student.photo = null;
        student.isExisting = true;
      } catch (err) {
        console.error("Student lookup error:", err);

        if (err?.response?.status === 404) {
          this.clearFields(student);
          this.$q.notify({
            type: "negative",
            position: "top",
            message: "No student found with that number.",
          });
        } else {
          this.$q.notify({
            type: "negative",
            position: "top",
            message: "Something went wrong while looking up the student.",
          });
        }
      } finally {
        student.lookupLoading = false;
      }
    },

    clearFields(student) {
      student.fullName = "";
      student.birthDate = "";
      student.college = "";
      student.course = "";
      student.photoUrl = null;
      student.isExisting = false;
    },

    onFileSelected(file, index) {
      if (!file) return;

      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);

        if (img.width !== 1024 || img.height !== 768) {
          this.$q.notify({
            type: "negative",
            position: "top",
            message: `Invalid image resolution. Recommended resolution size is 1024 × 768 pixels, but received ${img.width} × ${img.height} pixels.`,
          });
          this.students[index].photo = null;
          return;
        }

        // this.$q.notify({
        //   type: "positive",
        //   message: `${file.name} uploaded successfully`,
        // });
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        this.$q.notify({
          type: "negative",
          message: "Erro uploading image file.",
        });
        this.students[index].photo = null;
      };

      img.src = objectUrl;
    },

    onFileRejected() {
      this.$q.notify({
        type: "negative",
        position: "top",
        message: "File size must not exceed 5 MB.",
      });
    },

    addStudent() {
      this.students.push(emptyStudent());
    },

    removeStudent(index) {
      this.students.splice(index, 1);
    },

    onNext() {
      this.$emit(
        "next",
        this.students.map((s) => ({ ...s }))
      );
    },
  },
};
</script>

<style scoped>
.student-box {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 2px;
}
.student-photo {
  width: 190px;
  height: 150px;
  border-radius: 4px;
}
@media (max-width: 599px) {
  .student-photo {
    width: 225px;
    height: 150px;
    border-radius: 4px;
  }
}
</style>
