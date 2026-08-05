<template>
  <q-dialog
    v-model="RegistrationFormDialog"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card
      class="column no-wrap registration-card"
      style="width: 750px; max-width: 100%; max-height: 87vh"
    >
      <q-card-section
        class="header-panel row items-center justify-center relative-position"
      >
        <!-- <q-img
          class="header-logo"
          src="src/assets/uerm-logo.png"
          alt="UERM Medical Center Logo"
          contain
        /> -->
        <div class="column text-center">
          <div class="text-weight-bold text-subtitle1 text-uppercase">
            UERM Medical Center
          </div>
          <div class="text-white text-caption">Parent & Guardian Registration Form</div>
        </div>

        <q-btn
          flat
          round
          dense
          icon="close"
          color="white"
          class="absolute q-mr-md"
          style="right: 0; top: 50%; transform: translateY(-50%)"
          v-close-popup
        />
      </q-card-section>
      <q-card-section class="col scroll items-center step-section">
        <q-stepper
          v-model="step"
          ref="stepper"
          color="primary"
          done-color="positive"
          animated
          flat
          contracted
        >
          <q-step :name="1" title="Personal Info" icon="person" :done="step > 1">
            <parent-personal-info
              :prefill-data="formData.personalInfo"
              @next="handlePersonalInfoNext"
            />
          </q-step>

          <q-step :name="2" title="Add Students" icon="school" :done="step > 2">
            <add-students
              :prefill-students="formData.students"
              @prev="step = 1"
              @next="handleAddStudentsNext"
            />
          </q-step>

          <q-step :name="3" title="Review Details" icon="fact_check" :done="step > 3">
            <review-details :form-data="formData" @prev="step = 2" @next="step = 4" />
          </q-step>

          <q-step :name="4" title="Password" icon="lock">
            <set-password
              :submitting="submitting"
              @prev="step = 3"
              @submit="handleFinalSubmit"
            />
          </q-step>
        </q-stepper>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { api } from "boot/axios";
import ParentPersonalInfo from "../components/ParentPersonalInfo.vue";
import AddStudents from "../components/AddStudents.vue";
import ReviewDetails from "../components/ReviewDetails.vue";
import SetPassword from "../components/SetPassword.vue";

export default {
  name: "ParentRegistrationDialog",

  components: {
    ParentPersonalInfo,
    AddStudents,
    ReviewDetails,
    SetPassword,
  },

  data() {
    return {
      RegistrationFormDialog: true,
      step: 1,
      submitting: false,
      formData: {
        personalInfo: {},
        students: [],
        password: {},
      },
    };
  },

  methods: {
    show() {
      this.step = 1;
      this.formData = { personalInfo: {}, students: [], password: {} };
      this.RegistrationFormDialog = true;
    },

    handlePersonalInfoNext(data) {
      this.formData.personalInfo = data;
      this.step = 2;
    },

    handleAddStudentsNext(students) {
      this.formData.students = students;
      this.step = 3;
    },

    // async handleFinalSubmit(passwordData) {
    //   this.formData.password = passwordData;
    //   this.submitting = true;

    //   try {
    //     const { personalInfo, students } = this.formData;

    //     const payload = {
    //       firstName: personalInfo.firstName,
    //       lastName: personalInfo.lastName,
    //       middleInitial: personalInfo.middleName,
    //       relationship: personalInfo.relationship,
    //       email: personalInfo.email,
    //       mobileNum: personalInfo.mobile,
    //       students: students.map((s) => s.number).filter(Boolean),
    //       password: passwordData.password,
    //     };

    //     console.log("Registration payload:", payload);

    //     const response = await api.post(
    //       "http://10.107.0.2:3000/parent-portal/registration/register",
    //       payload
    //     );
    //     if (response.data.success) {
    //       this.RegistrationFormDialog = false;
    //     } else {
    //       // show response.data.message to user
    //     }
    //   } catch (err) {
    //     err.response?.data?.message;
    //   } finally {
    //     this.submitting = false;
    //   }
    // },

    async handleFinalSubmit(passwordData) {
      this.formData.password = passwordData;
      this.submitting = true;

      try {
        const { personalInfo, students } = this.formData;

        const payload = {
          firstName: personalInfo.firstName,
          lastName: personalInfo.lastName,
          middleInitial: personalInfo.middleName,
          relationship: personalInfo.relationship,
          email: personalInfo.email,
          mobileNum: personalInfo.mobile,
          students: students.map((s) => s.number).filter(Boolean),
          password: passwordData.password,
        };

        const response = await api.post(
          "http://10.107.0.2:3000/parent-portal/registration/register",
          payload
        );

        if (response.data.success) {
          this.$q.notify({
            type: "positive",
            position: "top",
            message: response.data.message || "Registration successful.",
          });
          this.RegistrationFormDialog = false;
          // this.$router.push("/");
        } else {
          this.$q.notify({
            type: "negative",
            position: "top",
            message: response.data.message || "Registration failed.",
          });
        }
      } catch (err) {
        this.$q.notify({
          type: "negative",
          position: "top",
          message:
            err.response?.data?.message || "Something went wrong. Please try again.",
        });
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>

<style scoped>
:deep(.q-stepper__dot) {
  font-size: 18px;
  width: 40px;
  height: 40px;
}
:deep(.q-stepper__line) {
  top: 5px;
}

:deep(.q-stepper__tab) {
  padding: 8px 16px;
}
:deep(.q-stepper__step-inner) {
  padding: 8px 16px 0;
}
:deep(.q-stepper__nav) {
  padding: 8px 16px;
}

.header-logo {
  width: 60px;
  height: 60px;
}

.header-panel {
  width: 750px;
  min-width: 250px;
  background: linear-gradient(160deg, #0d47a1, #123a8f);
  color: #ffffff;
  padding: 10px 20px 10px;
}

.step-section {
  padding: 20px 40px 30px;
}

@media (max-width: 599px) {
  .registration-card {
    max-height: 90vh;
  }

  .header-section {
    padding: 10px 12px;
  }

  .step-section {
    padding: 1px 10px 25px;
  }

  .header-panel {
    width: 100%;
    min-width: 100%;
    padding: 18px 16px;
  }

  :deep(.q-stepper__dot) {
    font-size: 14px;
    width: 26px;
    height: 26px;
  }

  :deep(.q-stepper__line) {
    top: 15px;
  }

  :deep(.q-stepper__nav) {
    padding: 12px 8px;
  }
}
</style>
