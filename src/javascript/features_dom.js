rabu_ns.FeaturesDom = function(element, estimates) {
	var list;
	var li;
	var divider;
	var included;
	var excluded;

	function toHtml(features, cssClass) {
		return features.reduce(function(sum, feature) {
			var css = cssClass;
			if (feature.isDone()) { css += " rabu-done"; }
			return sum + "<li class='" + css + "'>" + feature.name() + "</li>";
		}, "");
	}

	function populateFeatureList() {
		element.html(toHtml(estimates.includedFeatures(), "rabu-included"));
		element.append(toHtml(estimates.excludedFeatures(), "rabu-excluded"));

		list = $(".rabu-features");
		li = $("li", list);
		divider = $(".rabu-divider");
		included = $(".rabu-included", list);
		excluded = $(".rabu-excluded", list);
	}

	function positionDivider() {
		var dividerHeight = divider.outerHeight(true);
		excluded.each(function(index, element) {
			element	= $(element);
			var offset = element.offset();
			offset.top += dividerHeight;
			element.offset(offset);
		});

		var dividerTop;
		if (excluded.length === 0) {
			var lastIncluded = included.last();
			dividerTop = lastIncluded.offset().top + lastIncluded.outerHeight(true);
		}
		else {
			dividerTop = excluded.first().offset().top - dividerHeight;
		}
		divider.css("position", "absolute");
		divider.css("top", dividerTop);
	}

	function makeDraggable() {
		list = $(".rabu-features");
		divider.draggable({
			axis: 'y',
			containment: [0, list.offset().top, 0, list.offset().top + list.height()],
			scrollSpeed: 10,
			cursorAt: { top: (divider.outerHeight() / 2) }
		});
	}

	this.populate = function() {
		populateFeatureList();
		if (divider.length === 0) { return; }

		positionDivider();
		makeDraggable();
	};
};