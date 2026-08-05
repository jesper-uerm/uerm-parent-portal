<template>
  <q-form @submit="onSubmit" class="q-gutter-sm q-mt-sm">
    <div class="text-subtitle2 text-grey-8 q-mb-sm">Set Password</div>
    <q-input
      outlined
      dense
      v-model="password"
      :type="isPwd ? 'password' : 'text'"
      label="Password"
      :rules="[(v) => !!v || 'Required', (v) => v.length >= 8 || 'Minimum 8 characters']"
    >
      <template #append>
        <q-icon
          :name="isPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwd = !isPwd"
        />
      </template>
    </q-input>

    <q-input
      outlined
      dense
      v-model="confirmPassword"
      :type="isPwd ? 'password' : 'text'"
      label="Confirm Password"
      :rules="[(v) => v === password || 'Passwords do not match']"
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
        type="submit"
        color="accent"
        text-color="dark"
        label="Submit"
        icon-right="arrow_forward"
        :loading="submitting"
      />
    </div>
  </q-form>
</template>

<script>
export default {
  name: "ParentSetPassword",

  props: {
    submitting: { type: Boolean, default: false },
  },

  emits: ["prev", "submit"],

  data() {
    return {
      password: "",
      confirmPassword: "",
      isPwd: true,
    };
  },

  methods: {
    onSubmit() {
      if (this.password !== this.confirmPassword) return;
      this.$emit("submit", { password: this.password });
    },
  },
};
</script>
