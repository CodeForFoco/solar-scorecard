<template>
  <div id="app" class="page-container">
    <md-app>
      <md-app-toolbar class="md-primary" md-elevation="0">
        <md-button class="md-icon-button" @click="toggleMenu" v-if="!menuVisible">
          <md-icon>menu</md-icon>
        </md-button>
        <span class="md-title">Solar Scorecard</span>
      </md-app-toolbar>
      <md-app-drawer :md-active.sync="menuVisible" md-persistent="mini">
        <md-toolbar class="md-transparent" md-elevation="0">
          <span>Navigation</span>

          <div class="md-toolbar-section-end">
            <md-button class="md-icon-button md-dense" @click="toggleMenu">
              <md-icon>keyboard_arrow_left</md-icon>
            </md-button>
          </div>
        </md-toolbar>

        <md-list>
          <md-list-item>
            <md-icon>home</md-icon>
            <span class="md-list-item-text">Home</span>
          </md-list-item>

          <md-list-item>
            <md-icon>people</md-icon>
            <span class="md-list-item-text">About us</span>
          </md-list-item>

          <md-list-item>
            <md-icon>help</md-icon>
            <span class="md-list-item-text">How to help</span>
          </md-list-item>

          <md-list-item>
            <md-icon>place</md-icon>
            <span class="md-list-item-text">Where is my city?</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content>
        <div class="solarchart-wrap">
          <div class="solarchart-tabs"></div>
          <div class="solarchart-tab-content-wrapper">
            <div id="charts"></div>
          </div>
        </div>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      menuVisible: true,
    };
  },
  methods: {
    toggleMenu() {
      this.menuVisible = !this.menuVisible;
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'scss/main.scss';
</style>
