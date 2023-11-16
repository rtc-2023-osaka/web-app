<script>
	// Import web-component
	// Note: We are using an auto-import library for other libs to simplyfy demo
	import 'pose-camera';
	import { tick } from 'svelte';

	const LABELS_LIMIT = 2;
	const SAMPLES_LIMIT = 10;

	let poseCamera; // AI web component to capture poses
	let poseClassifier; // AI web component to classify poses

	let countdown = 0; // countdown before sending capture event, shows on screen if > 0
	let samples = 0;
	let label = null;
	let labels = [];
	let data = [];

	let classifier = null;
	let classificationResult = '';

	const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
	const shuffle = (arr) =>
		arr
			.map((value) => ({ value, sort: Math.random() }))
			.sort((a, b) => a.sort - b.sort)
			.map(({ value }) => value);
	const train = (data) => {
		const featureArray = Object.keys(data[0]).filter((v) => v !== 'label');
		const labelArray = data
			.map((row) => row.label)
			.filter((value, index, array) => array.indexOf(value) === index);

		const processedData = shuffle(data);

		const train_dataset = processedData.map((row) => featureArray.map((feature) => row[feature]));
		const train_labels = processedData.map((row) =>
			labelArray.findIndex((value) => value === row.label)
		);

		return {
			featureArray,
			labelArray,
			model: new KNN(train_dataset, train_labels, { k: 3 })
		};
	};
	// Captures event to send to the web component, will be triggered by a button,
	// Resets countdown, score and sends a capture event to web component after 6000ms (duration of countdown)
	const capture = async () => {
		label = prompt('Please input label:');

		if (!label) {
			return;
		}
		labels.push(label);

		samples = 0;

		while (samples < SAMPLES_LIMIT) {
			countdown = 3;
			await wait(4000);
			try {
				const pose = poseCamera.capture();
				countdown = 0;
				await wait(200);
				poseCamera.play();
				console.log(pose);
				data.push({
					...poseUtilities.poseToFeatures(pose),
					label
				});
			} catch (e) {
				console.log(e);
			}

			samples++;
		}
		samples = 0;
		console.log(data);

		if (labels.length >= LABELS_LIMIT) {
			const { featureArray, labelArray, model } = train(data);
			classifier = model;
			await tick();
			poseClassifier.featureArray = featureArray;
			poseClassifier.labelArray = labelArray;
			poseClassifier.classifier = classifier;

			poseClassifier.addEventListener('classification', (event) => {
				classificationResult = event.detail.classification;
			});
		}
	};
</script>

<section class="py-6 w-full">
	<!-- Container for Camera-AI web component, counter and score -->
	<div class="relative">
		{#if !classifier}
			<div class="w-96 h-64 mx-auto mb-4 items-center">
				<!-- AI Web component, binds to poseCamera variable to send event from svelte -->
				<rtc-camera-pose-capture bind:this={poseCamera} />
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
			</div>
		{/if}
		{#if classifier}
			<div class="w-96 h-64 mx-auto mb-4">
				<rtc-camera-pose-classifier bind:this={poseClassifier} />
				<div
					class="!absolute !flex top-0 z-10 text-2xl text-white p-3 rounded-br-[12px] leading-4 dark:bg-black dark:bg-opacity-50"
				>
					{classificationResult}
				</div>
			</div>
		{/if}
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
		<a href="/classifier#" on:click={capture}>
			<Button size="lg" color="red" disabled={samples > 0 || labels.length >= LABELS_LIMIT}>
				<IconifyIcon icon="ic:outline-camera" class="h-6 w-6 mr-2 -ml-1" />
				Train!
			</Button>
		</a>
	</div>
</section>
