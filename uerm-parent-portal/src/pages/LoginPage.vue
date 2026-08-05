<template>
  <q-layout view="lHh Lpr fff" class="main-background">
    <q-page-container>
      <q-page class="window-height window-width row justify-center items-center q-pa-md">
        <q-card class="login-card row no-wrap">
          <q-card-section class="header-panel column items-center justify-center q-py-md">
            <q-img
              src="src/assets/uerm-logo.png"
              alt="UERM Medical Center Logo"
              contain
              width="90px"
            />
            <div
              class="text-weight-bold text-subtitle1 text-uppercase q-mt-sm text-center"
            >
              UERM Medical Center
            </div>
            <div
              class="text-white text-caption text-center q-px-lg q-mt-sm branding-subtext"
            >
              Stay connected to your child's care and records, anytime.
            </div>
          </q-card-section>

          <q-card-section class="form-panel column justify-center">
            <div
              class="text-h6 text-weight-bold text-center q-mt-md"
              style="color: #1d1d1d"
            >
              Parent & Guardian Portal
            </div>
            <div class="text-caption text-grey-7 q-mb-md text-center">
              Sign in to continue to your account
            </div>

            <q-form @submit="onSubmit" class="q-gutter-y-sm">
              <q-input
                outlined
                dense
                v-model="Username"
                label="Email"
                autofocus
                lazy-rules
                class="input-box"
                :rules="[
                  (val) =>
                    (val && val.length > 0) || 'Please enter your Email or Mobile number',
                ]"
              >
                <template #prepend>
                  <q-icon name="person_outline" color="primary" size="20px" />
                </template>
              </q-input>

              <q-input
                outlined
                dense
                v-model="webPassword"
                :type="isPwd ? 'password' : 'text'"
                label="Password"
                lazy-rules
                class="input-box"
                :rules="[
                  (val) => (val && val.length > 0) || 'Please enter your password',
                ]"
              >
                <template #prepend>
                  <q-icon name="lock_outline" color="primary" size="20px" />
                </template>

                <template #append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    color="grey-6"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>

              <div class="row justify-end">
                <router-link
                  to="/forgot-password"
                  class="text-caption text-primary hover-underline"
                  style="text-decoration: none"
                >
                  Forgot password?
                </router-link>
              </div>

              <q-btn
                unelevated
                type="submit"
                color="accent"
                text-color="dark"
                label="Sign In"
                icon-right="arrow_forward"
                :loading="submitting"
                class="full-width login-btn text-weight-bold q-mt-sm"
              />
            </q-form>

            <div class="text-center q-mt-md text-grey-8">
              Don't have an account?
              <router-link
                to="/register"
                class="text-weight-bold hover-underline text-primary"
                style="text-decoration: none"
              >
                Register Here!
              </router-link>
            </div>

            <div class="text-caption text-grey-6 text-center q-mt-lg">
              &copy; {{ currentYear }} UERM Memorial Medical Center.
            </div>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { useAuthStore } from "../stores/authStore.js";

export default {
  name: "ParentPortalLoginPage",

  data() {
    return {
      Username: "",
      webPassword: "",
      isPwd: true,
      submitting: false,
    };
  },

  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
  },

  methods: {
    // async onSubmit() {
    //   this.submitting = true;

    //   try {
    //     const authStore = useAuthStore();
    //     const result = await authStore.login(this.Username, this.webPassword);

    //     if (result.success) {
    //       this.$router.push("/dashboard");
    //     } else {
    //       this.$q.notify({
    //         type: "negative",
    //         message: result.message,
    //       });
    //     }
    //   } catch (error) {
    //     console.error(error);
    //     this.$q.notify({
    //       type: "negative",
    //       message: "Something went wrong. Please try again.",
    //     });
    //   } finally {
    //     this.submitting = false;
    //   }
    // },
    async onSubmit() {
      this.submitting = true;

      try {
        const authStore = useAuthStore();
        const result = await authStore.login(this.Username, this.webPassword);

        if (result.success) {
          this.$q.loading.show({
            message: "Signing in...",
            spinnerColor: "white",
            messageColor: "white",
            backgroundColor: "primary",
          });

          await new Promise((resolve) => setTimeout(resolve, 1500));

          this.$q.loading.hide();

          this.$router.push("/dashboard");
        } else {
          this.$q.notify({
            type: "negative",
            message: result.message,
          });
        }
      } catch (error) {
        console.error(error);

        this.$q.notify({
          type: "negative",
          message: "Something went wrong. Please try again.",
        });
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>

<style scoped>
.main-background {
  min-height: 100vh;
  background-color: #0d47a1;
  background-image: linear-gradient(
      to top,
      rgba(20, 74, 173, 0.8),
      rgba(255, 214, 0, 0.5)
    ),
    url("src/assets/uerm-bg.jpg");
  background-position: center;
  background-attachment: fixed;
  background-size: cover;
}

.login-card {
  width: 100%;
  max-width: 750px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
}

.header-panel {
  width: 270px;
  min-width: 250px;
  background: linear-gradient(160deg, #0d47a1, #123a8f);
  color: #ffffff;
  padding: 32px 20px;
}

.branding-subtext {
  opacity: 0.85;
  line-height: 1.4;
}

.form-panel {
  min-width: 250px;
  flex: 1;
  padding: 30px 40px;
  background: #ffffff;
}

.input-box :deep(.q-field__control) {
  border-radius: 10px;
}

.login-btn {
  height: 46px;
  border-radius: 10px;
  letter-spacing: 0.3px;
}

.hover-underline:hover {
  text-decoration: underline;
}

@media (max-width: 599px) {
  .login-card {
    flex-direction: column;
    max-width: 400px;
  }

  .header-panel {
    width: 100%;
    min-width: 100%;
    padding: 18px 16px;
  }

  .header-panel .text-subtitle1 {
    font-size: 15px;
  }

  .branding-subtext {
    font-size: 11px;
  }

  .form-panel {
    width: 100%;
    min-width: 0;
    padding: 20px 20px;
  }

  .form-panel .text-h6 {
    font-size: 18px;
  }
}
</style>
