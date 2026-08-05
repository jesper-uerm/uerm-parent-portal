<template>
  <div class="q-mt-sm">
    <div class="text-subtitle2 text-grey-8 q-mb-sm">Personal Information</div>
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-sm-4">
        <q-input
          outlined
          dense
          readonly
          :model-value="formData.personalInfo.firstName"
          label="First Name"
        />
      </div>
      <div class="col-12 col-sm-4">
        <q-input
          outlined
          dense
          readonly
          :model-value="formData.personalInfo.lastName"
          label="Last Name"
        />
      </div>
      <div class="col-12 col-sm-4">
        <q-input
          outlined
          dense
          readonly
          :model-value="formData.personalInfo.middleName"
          label="Middle Name"
        />
      </div>
      <div class="col-12 col-sm-4">
        <q-input
          outlined
          dense
          readonly
          :model-value="formData.personalInfo.email"
          label="Email"
        />
      </div>
      <div class="col-12 col-sm-4">
        <q-input
          outlined
          dense
          readonly
          :model-value="formData.personalInfo.mobile"
          label="Mobile Number"
        />
      </div>
      <div class="col-12 col-sm-4">
        <q-input
          outlined
          dense
          readonly
          :model-value="formData.personalInfo.relationship"
          label="Relationship"
        />
      </div>
    </div>

    <div class="text-subtitle2 text-grey-8 q-mb-sm">Students</div>
    <q-list bordered separator class="q-mb-md">
      <q-item v-for="(student, index) in formData.students" :key="index">
        <q-item-section>
          <q-item-label>{{ student.fullName || "—" }}</q-item-label>
          <q-item-label caption>{{ student.college || "—" }}</q-item-label>
          <q-item-label caption>
            {{ student.course || "—" }} &bull; {{ student.number || "—" }} &bull;
            {{ student.birthDate || "—" }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

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
        text-color="dark"
        label="Continue"
        icon-right="arrow_forward"
        @click="$emit('next')"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "ParentReviewDetails",

  props: {
    formData: { type: Object, required: true },
  },

  emits: ["prev", "next"],
};
</script>
