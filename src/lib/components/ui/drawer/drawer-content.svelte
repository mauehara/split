<script lang="ts">
	import { Drawer as DrawerPrimitive } from "vaul-svelte";
	import DrawerOverlay from "./drawer-overlay.svelte";
	import { cn } from "$lib/utils.js";

	type $$Props = DrawerPrimitive.ContentProps;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<DrawerPrimitive.Portal>
	<DrawerOverlay />
	<DrawerPrimitive.Content
		class={cn(
			"fixed inset-x-0 top-0 z-50 flex h-auto flex-col rounded-b-[10px] border bg-background",
			className
		)}
		{...$$restProps}
	>
		<slot />
		<div class="mx-auto mb-4 h-2 w-[100px] rounded-full bg-muted"></div>
	</DrawerPrimitive.Content>
</DrawerPrimitive.Portal>
