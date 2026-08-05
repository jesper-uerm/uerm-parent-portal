<template>
  <q-page class="q-pa-md bg-grey-4 q-py-md">
    <q-card class="profile-card no-shadow">
      <!-- <q-card-section class="q-py-md q-px-lg bg-primary text-white">
        <div class="text-h6 text-weight-bold">PARENT PROFILE</div>
        <div class="text-caption text-grey-3">
          View your personal account information.
        </div>
      </q-card-section> -->

      <q-card-section class="q-pa-md bg-grey-1">
        <div v-if="loading" class="column items-center q-pa-xl">
          <q-spinner color="primary" size="40px" />
          <div class="q-mt-md text-grey-7">Loading profile...</div>
        </div>

        <div v-else-if="error" class="text-center text-negative q-pa-lg">
          {{ error }}
        </div>

        <div
          v-else-if="parent"
          class="row q-col-gutter-xl justify-center items-center"
          style="min-height: 420px"
        >
          <div class="col-12 col-md-3">
            <div class="column items-center justify-center full-height text-center">
              <div class="profile-image">
                <img
                  v-if="form.photo"
                  :src="form.photo"
                  alt="Profile Photo"
                  class="profile-photo"
                />

                <div v-else class="profile-placeholder">
                  <q-icon name="person" size="90px" color="grey-6" />
                </div>
              </div>

              <q-file
                ref="photoInput"
                v-model="selectedPhoto"
                accept=".jpg,.jpeg,.png"
                class="hidden"
                @update:model-value="uploadPhoto"
              />

              <div class="text-h6 text-weight-bold q-mt-lg">
                {{ form.firstName }} {{ form.lastName }}
              </div>

              <div class="text-grey-7 q-mt-xs q-mb-lg">
                {{ form.email }}
              </div>

              <q-btn
                outline
                color="primary"
                icon="photo_camera"
                label="Change Photo"
                no-caps
                :disable="!isEditing"
                @click="$refs.photoInput.pickFiles()"
              />
            </div>
          </div>

          <div class="col-12 col-md-9">
            <div class="row items-center justify-between q-mb-md">
              <div class="text-subtitle1 text-weight-bold text-primary">
                Personal Information
              </div>

              <div class="row q-gutter-sm">
                <q-btn
                  v-if="!isEditing"
                  color="primary"
                  icon="edit"
                  label="Edit Profile"
                  no-caps
                  @click="startEdit"
                />

                <q-btn
                  v-if="!isEditing"
                  outline
                  color="primary"
                  icon="lock_reset"
                  label="Change Password"
                  no-caps
                  @click="passwordDialog = true"
                />

                <template v-else>
                  <q-btn
                    color="positive"
                    icon="save"
                    label="Save"
                    no-caps
                    @click="saveProfile"
                  />

                  <q-btn
                    flat
                    color="negative"
                    label="Cancel"
                    class="q-ml-sm"
                    no-caps
                    @click="cancelEdit"
                  />
                </template>
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  outlined
                  dense
                  v-model="form.firstName"
                  :readonly="!isEditing"
                  label="First Name"
                />
              </div>

              <div class="col-12 col-md-6">
                <q-input
                  outlined
                  dense
                  v-model="form.lastName"
                  :readonly="!isEditing"
                  label="Last Name"
                />
              </div>

              <div class="col-12 col-md-6">
                <q-input
                  outlined
                  dense
                  v-model="form.email"
                  :readonly="!isEditing"
                  label="Email Address"
                />
              </div>

              <div class="col-12 col-md-6">
                <q-input
                  outlined
                  dense
                  v-model="form.mobileNum"
                  :readonly="!isEditing"
                  label="Mobile Number"
                />
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-dialog
      v-model="passwordDialog"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card style="width: 450px; max-width: 95vw; overflow: hidden">
        <q-card-section class="bg-primary text-white q-py-lg">
          <div class="row items-center no-wrap">
            <q-avatar color="white" text-color="primary" icon="lock_reset" size="48px" />

            <div class="q-ml-md">
              <div class="text-h6 text-weight-bold">Change Password</div>

              <div class="text-caption text-grey-3">
                Update your account password securely.
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-section class="q-pa-lg">
          <q-input
            outlined
            dense
            v-model="password.currentPassword"
            :type="showCurrent ? 'text' : 'password'"
            label="Current Password"
            prepend-icon="lock"
            autocomplete="current-password"
          >
            <template v-slot:append>
              <q-icon
                class="cursor-pointer"
                :name="showCurrent ? 'visibility_off' : 'visibility'"
                @click="showCurrent = !showCurrent"
              />
            </template>
          </q-input>

          <q-input
            class="q-mt-md"
            outlined
            dense
            v-model="password.newPassword"
            :type="showNew ? 'text' : 'password'"
            label="New Password"
            prepend-icon="vpn_key"
            autocomplete="new-password"
            :error="password.newPassword.length > 0 && password.newPassword.length < 8"
            error-message="Password must be at least 8 characters."
          >
            <template v-slot:append>
              <q-icon
                class="cursor-pointer"
                :name="showNew ? 'visibility_off' : 'visibility'"
                @click="showNew = !showNew"
              />
            </template>
          </q-input>

          <q-input
            class="q-mt-sm"
            outlined
            dense
            v-model="password.confirmPassword"
            :type="showConfirm ? 'text' : 'password'"
            label="Confirm New Password"
            prepend-icon="verified_user"
            autocomplete="new-password"
            :error="
              password.confirmPassword.length > 0 &&
              password.newPassword !== password.confirmPassword
            "
            error-message="Passwords do not match."
          >
            <template v-slot:append>
              <q-icon
                v-if="password.confirmPassword"
                :name="
                  password.newPassword === password.confirmPassword
                    ? 'check_circle'
                    : 'cancel'
                "
                :color="
                  password.newPassword === password.confirmPassword
                    ? 'positive'
                    : 'negative'
                "
                class="q-mr-sm"
              />

              <q-icon
                class="cursor-pointer"
                :name="showConfirm ? 'visibility_off' : 'visibility'"
                @click="showConfirm = !showConfirm"
              />
            </template>
          </q-input>
        </q-card-section>

        <q-separator />

        <q-card-actions class="q-pa-md justify-end">
          <q-btn flat color="grey-7" icon="close" label="Cancel" no-caps v-close-popup />

          <q-btn
            unelevated
            color="primary"
            icon="lock_reset"
            label="Update Password"
            no-caps
            :disable="
              !password.currentPassword ||
              password.newPassword.length < 8 ||
              password.newPassword !== password.confirmPassword
            "
            @click="changePassword"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapState } from "pinia";
import { useAuthStore } from "../stores/authStore.js";
import { api } from "boot/axios";

export default {
  name: "ParentProfile",

  data() {
    return {
      parent: null,
      form: {},
      loading: false,
      error: null,
      isEditing: false,
      selectedPhoto: null,

      passwordDialog: false,

      password: {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      },

      showCurrent: false,
      showNew: false,
      showConfirm: false,
    };
  },

  computed: {
    ...mapState(useAuthStore, ["user"]),
  },

  async mounted() {
    await this.fetchParent();
  },

  methods: {
    async fetchParent() {
      if (!this.user?.id) return;

      this.loading = true;
      this.error = null;

      try {
        const { data } = await api.get(`/parent-portal/parents/${this.user.id}`);

        this.parent = data;
        this.form = { ...data };
      } catch (err) {
        console.error("Failed to fetch parent info:", err);
        this.error = err.response?.data?.message || "Failed to load parent information.";
      } finally {
        this.loading = false;
      }
    },

    startEdit() {
      this.form = { ...this.parent };
      this.isEditing = true;
    },

    cancelEdit() {
      this.form = { ...this.parent };
      this.isEditing = false;
    },

    uploadPhoto(file) {
      if (!file) return;

      const maxSize = 5 * 1024 * 1024;

      if (file.size > maxSize) {
        this.$q.notify({
          type: "negative",
          message: "Image must not exceed 5 MB.",
        });

        this.selectedPhoto = null;
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        this.form.photo = reader.result;
      };

      reader.readAsDataURL(file);
    },

    async saveProfile() {
      this.$q
        .dialog({
          title: "Save Changes",
          message: "Do you want to save the changes made to your profile?",
          icon: "save",
          cancel: {
            flat: true,
            label: "Cancel",
          },
          ok: {
            color: "primary",
            label: "Save",
          },
          persistent: true,
        })
        .onOk(async () => {
          try {
            const payload = {
              firstName: this.form.firstName,
              lastName: this.form.lastName,
              middleInitial: this.form.middleInitial,
              email: this.form.email,
              mobileNum: this.form.mobileNum,
              photo: this.form.photo,
            };

            const { data } = await api.put(
              `/parent-portal/parents/${this.user.id}`,
              payload
            );

            this.parent = { ...data };
            this.form = { ...data };

            const authStore = useAuthStore();

            authStore.user = {
              ...authStore.user,
              ...data,
            };

            localStorage.setItem("auth_user", JSON.stringify(authStore.user));

            this.isEditing = false;

            this.$q.notify({
              type: "positive",
              message: "Profile updated successfully.",
            });
          } catch (err) {
            console.error(err);

            this.$q.notify({
              type: "negative",
              message: err.response?.data?.message || "Failed to update profile.",
            });
          }
        });
    },
    async changePassword() {
      if (
        !this.password.currentPassword ||
        !this.password.newPassword ||
        !this.password.confirmPassword
      ) {
        this.$q.notify({
          type: "negative",
          message: "Please complete all fields.",
        });
        return;
      }

      if (this.password.newPassword !== this.password.confirmPassword) {
        this.$q.notify({
          type: "negative",
          message: "Passwords do not match.",
        });
        return;
      }

      try {
        await api.put(`/parent-portal/parents/${this.user.id}/password`, {
          currentPassword: this.password.currentPassword,
          newPassword: this.password.newPassword,
        });

        this.$q.notify({
          type: "positive",
          message: "Password changed successfully.",
        });

        this.passwordDialog = false;

        this.password = {
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        };
      } catch (err) {
        this.$q.notify({
          type: "negative",
          message: err.response?.data?.message || "Unable to change password.",
        });
      }
    },
  },
};
</script>

<style scoped>
.profile-image {
  width: 170px;
  height: 170px;
}

.profile-photo,
.profile-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 5px solid #fff;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.profile-photo {
  object-fit: cover;
}

.profile-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e0e0e0;
}

.profile-card {
  border: 1px solid #e0e0e0;
  overflow: hidden;
}

.profile-avatar {
  border: 5px solid #fff;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.hidden {
  display: none;
}

.q-card-section.bg-grey-1 {
  min-height: 420px;
}
</style>
