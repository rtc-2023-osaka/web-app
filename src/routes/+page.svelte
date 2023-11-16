<Section name="heroDefault">
	<HeroHeader>
		<svelte:fragment slot="h1">
			<img src="/ai.svg" alt="ai" class="relative mx-auto max-w my-5"/>
			RTC 2023 Osaka Satellite
		</svelte:fragment>
		<svelte:fragment slot="paragraph">AI Workshop - 
			Creating <span class="font-bold text-red-500">a Web App</span> 
			using <span class="font-bold text-red-500">TensorFlow.js</span> 
			and <span class="font-bold text-red-500">Web Components</span>
		</svelte:fragment>
	</HeroHeader>
	<HeroBody class="flex flex-row mb-8 space-x-2 content-center justify-center">
		<a href="/similarity">
			<Button size="lg" color="red">
				Similarity
				<IconifyIcon icon="mdi:arrow-right-bold" class="h-6 w-6 ml-2 -mr-1" />
			</Button>
		</a>
		<a href="/classifier">
			<Button size="lg" color="red">
				Train your own Classifier!
				<IconifyIcon icon="mdi:arrow-right-bold" class="h-6 w-6 ml-2 -mr-1" />
			</Button>
		</a>
	</HeroBody>
</Section>
