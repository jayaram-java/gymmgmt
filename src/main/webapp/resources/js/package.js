$(document).ready(function() {
	$("#packageForm").hide();
	$("#closeForm").hide(); // Hide the close button initially


	$("#addPackage").click(function() {
		$("#packageForm").toggle();
		$("#closeForm").hide(); // Hide the close button if it was shown for editing
		if ($("#form").is(":visible")) {
			$("#addPackage").text("Close");
		} else {
			$("#addPackage").text("Add Package");
		}
	});


	$("#register").click(function() {
		var id = $("#packageId").val();
		var packageName = $("#packageName").val();
		var description = $("#description").val();
		var price = $("#price").val();
		var duration = $("#duration").val();

		if (packageName && description && price && duration) {
			var packageDto = {
				"id": id,
				"packageName": packageName,
				"description": description,
				"price": price,
				"duration": duration
			};

			var url = id === "" ? "/gym-mgmt/packages/savePackages" : "/gym-mgmt/packages/updatePackages";

			$.ajax({
				url: url,
				type: "POST",
				dataType: 'json',
				contentType: "application/json",
				data: JSON.stringify(packageDto),
				success: function(data) {
					if (data === true) {
						$("#successMessage").show();
						setTimeout(function() {
							$("#successMessage").hide();
							window.location.reload();
						}, 2000);
					} else {
						alert("Failed to save the package.");
					}
				},
				error: function() {
					alert("An error occurred while saving the package.");
				}
			});
		} else {
			alert("Please enter all fields.");
		}
	});

	function loadPackages() {
		$.ajax({
			url: "/gym-mgmt/packages/getAllPackages",
			type: "GET",
			dataType: "json",
			success: function(data) {
				var packageCards = $("#packageCards");
				packageCards.empty();

				$.each(data, function(index, pkg) {
					var card = $("<div>").addClass("card");
					card.append($("<h3>").text(pkg.packageName));
					card.append($("<p>").text("Description: " + pkg.description));
					card.append($("<p>").text("Price: " + pkg.price));
					card.append($("<p>").text("Duration: " + pkg.duration));

					var editButton = $("<button>").text("Edit").click(function() {
						editPackage(pkg);
					});
					card.append(editButton);

					packageCards.append(card);
				});
			},
			error: function() {
				alert("Failed to load package details. Please try again later.");
			}
		});
	}



	function editPackage(pkg) {

		if (pkg && pkg.id !== undefined && pkg.packageName && pkg.description && pkg.price !== undefined && pkg.duration !== undefined) {
			$("#packageId").val(pkg.id);
			$("#packageName").val(pkg.packageName);
			$("#description").val(pkg.description);
			$("#price").val(pkg.price);
			$("#duration").val(pkg.duration);

			// Show the package form and close button
			$("#packageForm").show();
			$("#closeForm").show();

			// Change the button text to 'Close'
			$("#addPackage").text("Close");
		} else {
			console.error("Invalid package object provided:", pkg);
		}
	}

 loadPackages();

        $("#closeForm").click(function() {
            window.location.reload();
        });


});