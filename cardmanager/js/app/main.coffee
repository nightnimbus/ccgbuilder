define(
	[
		"jquery",
		"shared/classes/managers/view.manager",
		"shared/classes/globals.class",
		"jqueryui"
	],
(
	$,
	ViewManager,
	Globals
) ->
	$(
		() ->
			console.log "App initializing..."
			Globals.initialize()

			require ["jqte"], () ->
				$(".editor").jqte()
				console.log "App initialized!"
	)
)