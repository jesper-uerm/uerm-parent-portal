<template>
  <q-layout view="lHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <div class="text-weight-bold row items-center">
          <div class="text-caption text-grey-2 gt-xs" style="line-height: 1.2">
            Parent and Guardian Portal
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      :width="260"
      class="text-grey-9 shadow-1"
      :breakpoint="600"
      v-model="leftDrawerOpen"
      side="left"
      bordered
    >
      <div class="column">
        <div class="profile-header q-pa-lg">
          <div class="profile-image">
            <img
              v-if="authStore.user?.photo"
              :src="authStore.user.photo"
              alt="Parent Profile"
              class="profile-photo"
            />

            <div v-else class="profile-placeholder">
              <q-icon name="person" size="60px" color="grey-6" />
            </div>
          </div>

          <div class="text-h6 text-weight-bold text-primary q-mt-md">
            {{ fullName }}
          </div>

          <div class="text-caption text-grey-7 text-uppercase">Parent / Guardian</div>
        </div>

        <div class="col column justify-center q-px-md">
          <q-btn
            color="primary"
            class="full-width nav-btn q-mb-md"
            label="HOME"
            no-caps
            to="/dashboard"
            :outline="$route.path !== '/dashboard'"
            :unelevated="$route.path === '/dashboard'"
          />

          <q-btn
            color="primary"
            class="full-width nav-btn q-mb-md"
            label="MY STUDENTS"
            no-caps
            to="/students"
            :outline="$route.path !== '/students'"
            :unelevated="$route.path === '/students'"
          />

          <q-btn
            color="primary"
            class="full-width nav-btn q-mb-md"
            label="PROFILE"
            no-caps
            to="/profile"
            :outline="$route.path !== '/profile'"
            :unelevated="$route.path === '/profile'"
          />

          <q-space />

          <q-btn
            outline
            color="negative"
            class="full-width nav-btn"
            label="LOGOUT"
            no-caps
            icon="logout"
            @click="handleLogout"
          />
        </div>
      </div>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { useAuthStore } from "../stores/authStore.js";

export default {
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },

  async mounted() {
    await this.loadProfilePhoto();
  },

  data() {
    return {
      leftDrawerOpen: false,
    };
  },

  computed: {
    fullName() {
      if (!this.authStore.user) return "";
      return `${this.authStore.user.firstName} ${this.authStore.user.lastName}`;
    },
  },

  methods: {
    async loadProfilePhoto() {
      if (!this.authStore.user?.id) return;

      try {
        const { data } = await this.$api.get(
          `/parent-portal/parents/${this.authStore.user.id}`
        );

        this.authStore.user.photo = data.photo;
      } catch (err) {
        console.error("Failed to load profile photo", err);
      }
    },
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
    handleLogout() {
      this.authStore.logout();
      this.$router.push("/");
    },
  },
};
</script>
<style scoped>
.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 28px 20px;
  margin: 16px;
  border-radius: 18px;
  background: #ffffff;
  border: 1px solid #e6eaf0;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

.profile-avatar {
  border: 4px solid #ffffff;
  box-shadow: 0 8px 24px rgba(0, 74, 173, 0.18);
}

.profile-header .text-h6 {
  letter-spacing: 0.3px;
}

.profile-header .text-caption {
  letter-spacing: 0.8px;
}

.profile-image {
  width: 110px;
  height: 110px;
  margin: 0 auto;
}

.profile-photo,
.profile-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid #ffffff;
  object-fit: cover;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.profile-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}
</style>
