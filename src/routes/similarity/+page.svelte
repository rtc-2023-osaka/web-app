<script>
	// Import web-component
	// Note: We are using an auto-import library for other libs to simplyfy demo
	import { CameraPoseCaptureSimilarityElement } from 'pose-camera';

	// Reactive Local State
	let cameraPose; // AI web component
	let countdown = 0; // countdown before sending capture event, shows on screen if > 0
	let result = null; // result object returned from web component after capture
	let score = 0; // calculated similarity, shows on screen if > 0, reset at each capture

	// Captures event to send to the web component, will be triggered by a button,
	// Resets countdown, score and sends a capture event to web component after 6000ms (duration of countdown)
	const capture = async () => {
		cameraPose.play();
		countdown = 3; // shows countdown from 3
		score = 0; // hides score before capturing
		setTimeout(() => {
			countdown = 0;
			try {
				result = cameraPose.capture(); // result returned by web component
				console.log(result);
				if (result.score)
					score = result.score.toFixed(2) * 100 + '%'; // shows score returned by web-component
				else score = '0%'; // shows dummy result for testing
			} catch (e) {
				console.log(e);
			}
		}, 6000); // Waits 6000ms before sending a capture event
	};
</script>

<section class="py-6 w-full">
	<!-- Container for Camera-AI web component, counter and score -->
	<div class="relative">
		<div class="w-96 h-64 mx-auto mb-4">
			<!-- AI Web component, binds to cameraPose variable to send event from svelte -->
			<rtc-camera-pose-capture-similarity
				bind:this={cameraPose}
				sample-rate="40"
				src="/lightning-bolt-pose.jpeg"
			/>
			{#if countdown > 0}
				<!-- Animated Svelte Counter from https://github.com/benzara-tahar/svelte-animated-counter -->
				<AnimatedCounter
					values={Array.from({ length: countdown + 1 }, (_, i) => i.toString())}
					class="!absolute !flex inset-0 !h-full justify-center items-center z-10 text-9xl text-white"
					interval={1500}
					startImmediately={false}
					loop={false}
					ease="cubic-bezier(0.25, 0.1, 0.25, 1)"
				/>
			{/if}
			<!-- Shows score returned by capture event in the same style as counter (they are not shown at the same time) -->
			{#if score}
				<div
					class="!absolute !flex inset-0 !h-full justify-center items-center z-10 text-9xl text-white"
				>
					{score}
				</div>
			{/if}
		</div>
	</div>

	<!-- Container for Home and Capture buttons -->
	<div class="flex flex-row mb-8 space-x-2 content-center justify-center">
		<a href="/">
			<Button size="lg" color="red">
				<IconifyIcon icon="mdi:home" class="h-6 w-6 mr-2 -ml-1" />
				Home
			</Button>
		</a>
		<!-- Triggers local capture event which in turn triggers web-component capture event after timeout -->
		<a href="/similarity#" on:click={capture}>
			<Button size="lg" color="red" disabled={countdown > 0}>
				<IconifyIcon icon="ic:outline-camera" class="h-6 w-6 mr-2 -ml-1" />
				Capture!
			</Button>
		</a>
	</div>
</section>
