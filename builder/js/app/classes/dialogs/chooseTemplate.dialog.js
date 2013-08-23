define(
	[
		"jquery",
		"shared/classes/managers/view.manager",
		"shared/classes/helpers/string.helper",
		"shared/classes/dialog.class",
		"enums/sortType.enum",
		"jqueryui"
	],
function(
	$,
	ViewManager,
	StringHelper,
	Dialog,
	SortType)
{
	var ChooseTemplateDialog = Dialog.extend(
	{
		selectors: {},
		sortType: null,

		initialize: function()
		{
			this.sortType = (typeof initialSortType !== "undefined") ? initialSortType : SortType.Front;
			this.selectors.sortBack = "#sortBack";
			this.selectors.sortFront = "#sortFront";
			this.selectors.sortBackLink = "#sortBackLink";
			this.selectors.sortFrontLink = "#sortFrontLink";

			this.refreshSorting();

			var self = this;
			this.getDialog().dialog(
			{
				autoOpen: false,
				width: 600,
				height: 600,
				minWidth: 400,
				minHeight: 400,
				modal: true,
				resizable: true,
				open: function()
				{
					self.attachEvents();
				},
				close: function()
				{
					self.detachEvents();
				}
			});
		},
		refreshSorting: function()
		{
			switch(this.sortType)
			{
				case SortType.Back:
					$(this.selectors.sortBack).show();
					$(this.selectors.sortBackLink).addClass("sort-link-selected");

					$(this.selectors.sortFront).hide();
					$(this.selectors.sortFrontLink).removeClass("sort-link-selected");
					break;

				case SortType.Front:
					$(this.selectors.sortFront).show();
					$(this.selectors.sortFrontLink).addClass("sort-link-selected");

					$(this.selectors.sortBack).hide();
					$(this.selectors.sortBackLink).removeClass("sort-link-selected");
					break;
			}
		},
		attachEvents: function()
		{
			var self = this;

			$(".sort-link").on("click", function(e)
			{
				e.preventDefault();

				self.sortType = (e.target.id == self.selectors.sortBackLink.substr(1)) ? SortType.Back : SortType.Front;
				self.refreshSorting();
			});

			$(".prebuilt-template").on("click", function(e)
			{
				if($(this).hasClass("back-template"))
					$(".back-template").removeClass("prebuilt-template-selected");
				else
					$(".front-template").removeClass("prebuilt-template-selected");

				$(this).addClass("prebuilt-template-selected");

				var data = StringHelper.getDataFromCSSUrl($(this).css("background-image"));
				var components = StringHelper.getImageUriComponents(data);

				ViewManager.views.chooseTemplate.resizePreBuiltTemplateToAllSizes(data, components.type, self.sortType);
			});
		},
		detachEvents: function()
		{
			$(".sort-link").off("click");
			$(".prebuilt-template").off("click");
		}
	});

	return ChooseTemplateDialog;
});