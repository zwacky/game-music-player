<template>
	<ion-app>
		<router-view />
	</ion-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component
export default class extends Vue {}
</script>

<style lang="scss">
@import './app.scss';
</style>
