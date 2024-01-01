<!-- source: the following code is utlized some of the example from https://svelte.dev/examples/modal  -->
<script>
	export let showModal; // boolean
	export let closeMessage; // the message for the button to close
	export let action; // a function

	let dialog;

	$: if (dialog && showModal) dialog.showModal();

	function actionAfterClosingTheButton() {
		dialog.close();
		action();
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => dialog.close()}
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<!-- stopPrpgation closes the modal if we click on the background -->
	<div on:click|stopPropagation>
		<hr />
		<slot />
		<hr />
		<button class="btn btn-primary" on:click={() => actionAfterClosingTheButton()}
			>{closeMessage}</button
		>
	</div>
</dialog>

<style>
	dialog {
		max-width: 40em;
		border: 20px;
		padding: 0;
	}
	dialog > div {
		padding: 2em;
	}
</style>
