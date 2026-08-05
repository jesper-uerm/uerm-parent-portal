<template>
  <q-form @submit="onSubmit" class="q-gutter-md q-mt-sm items-center">
    <div class="text-subtitle2 text-grey-8 q-mb-sm">Personal Information</div>
    <div class="row q-col-gutter-sm">
      <div class="col-12 col-sm-6">
        <q-input
          outlined
          dense
          v-model="formData.email"
          type="email"
          label
          :rules="[(v) => !!v || 'Required']"
        >
          <template #label> Email <span class="text-red">*</span> </template>
        </q-input>
      </div>

      <div class="col-12 col-sm-6">
        <q-input
          outlined
          dense
          v-model="formData.lastName"
          label
          :rules="[(v) => !!v || 'Required']"
        >
          <template #label> Last Name <span class="text-red">*</span> </template>
        </q-input>
      </div>

      <div class="col-12 col-sm-6">
        <q-input
          outlined
          dense
          v-model="formData.mobile"
          label
          mask="####-###-####"
          unmasked-value
          :rules="[(v) => !!v || 'Required']"
        >
          <template #label> Mobile Number <span class="text-red">*</span> </template>
        </q-input>
      </div>

      <div class="col-12 col-sm-6">
        <q-input
          outlined
          dense
          v-model="formData.firstName"
          label
          :rules="[(v) => !!v || 'Required']"
        >
          <template #label> First Name <span class="text-red">*</span> </template>
        </q-input>
      </div>

      <div class="col-12 col-sm-6">
        <q-select
          outlined
          dense
          v-model="formData.relationship"
          label
          :options="relationshipOptions"
          :rules="[(v) => !!v || 'Required']"
        >
          <template #label> Relationship <span class="text-red">*</span> </template>
        </q-select>
      </div>

      <div class="col-12 col-sm-6">
        <q-input outlined dense v-model="formData.middleName" label="Middle Initial" />
      </div>
    </div>

    <div class="row justify-center q-gutter-sm q-mt-md">
      <q-btn
        unelevated
        type="submit"
        color="accent"
        label="Continue"
        icon-right="arrow_forward"
        text-color="dark"
      />
    </div>
  </q-form>
</template>

<script>
export default {
  name: "ParentPersonalInfo",

  props: {
    prefillData: { type: Object, default: () => ({}) },
  },

  emits: ["next"],

  data() {
    return {
      relationshipOptions: ["Mother", "Father", "Guardian", "Grandparent", "Other"],

      formData: {
        firstName: this.prefillData.firstName || "",
        middleName: this.prefillData.middleName || "",
        lastName: this.prefillData.lastName || "",
        email: this.prefillData.email || "",
        mobile: this.prefillData.mobile || "",
        relationship: this.prefillData.relationship || "",
      },
    };
  },

  methods: {
    onSubmit() {
      this.$emit("next", { ...this.formData });
    },
  },
};
</script>
