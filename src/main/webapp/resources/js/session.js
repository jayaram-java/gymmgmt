$(document).ready(function() {
    $("#form").hide(); // Hide the form initially
    $("#closeForm").hide(); // Hide the close button initially

    $("#addSession").click(function() {
        $("#form").toggle(); // Toggle the form visibility on button click
        $("#closeForm").hide(); // Hide the close button if it was shown for editing
        if ($("#form").is(":visible")) {
            $("#addSession").text("Close");
        } else {
            $("#addSession").text("Add Session");
        }
    });

    $("#submit").click(function() {
        var id = $("#sessionId").val();
        var name = $("#name").val();
        var price = $("#price").val();
        var duration = $("#duration").val();

        // Validate that all fields are filled
        if (name && price && duration) {
            var sessionDto = {
                "id": id,
                "name": name,
                "price": price,
                "duration": duration
            };

            // Determine if we are adding or updating based on the presence of id
            if (id === "") {
                $.ajax({
                    url: "/gym-mgmt/api/sessions/addSession",
                    type: "POST",
                    dataType: 'json',
                    contentType: "application/json",
                    data: JSON.stringify(sessionDto),
                    success: function(data) {
                        if (data === true) {
                            $("#successMessage").show(); // Show success message
                            setTimeout(function() {
                                $("#successMessage").hide();
                                window.location.reload(); // Reload page after successful submission
                            }, 2000); // Hide message after 2 seconds
                        } else {
                            alert("The session could not be added."); // Show alert if data is not true
                        }
                    },
                    error: function() {
                        alert("An error occurred while saving the session."); // Show error if AJAX request fails
                    }
                });
            } else {
                $.ajax({
                    url: "/gym-mgmt/api/sessions/updateSession",
                    type: "POST",
                    dataType: 'json',
                    contentType: "application/json",
                    data: JSON.stringify(sessionDto),
                    success: function(data) {
                        if (data === true) {
                            $("#successMessage").show(); // Show success message
                            setTimeout(function() {
                                $("#successMessage").hide();
                                window.location.reload(); // Reload page after successful submission
                            }, 2000); // Hide message after 2 seconds
                        } else {
                            swal({
                                title: "",
                                text: "Session not updated.",
                                type: "warning",
                            });
                        }
                    },
                    error: function() {
                        alert("An error occurred while updating the session details.");
                    }
                });
            }
        } else {
            alert("Please enter all fields."); // Show alert if any required field is empty
        }
    });

    // Function to initialize DataTable for session data
    function sessionDataTable() {
        $('#sessiondataTable').DataTable({
            "ajax": {
                "url": "/gym-mgmt/api/sessions/getSession",
                "type": 'GET',
                "datatype": "json",
                "dataSrc": ""
            },
            "columns": [
                { "data": "id", "visible": false }, // Hide ID column
                { "data": "name" },
                { "data": "price" },
                {
                    "data": "duration",
                    "render": function(data, type, row) {
                        return data + " MINS"; // Display duration with "mins" suffix
                    }
                },
                {
                    "data": null,
                    "render": function(data, type, row) {
                        return '<a href="#" class="button" onclick="getByID(' + row.id + ')">Edit</a>'; // Edit button with getByID function call
                    }
                }
            ]
        });
    }

    window.getByID = function(id) {
        $("#sessionId").val(id); // Set session ID in a hidden input field

        // AJAX request to get session details
        $.ajax({
            url: "/gym-mgmt/api/sessions/getSessionById",
            type: "GET",
            data: {
                'id': id,
            },
            success: function(data) {
				$("#addSession").hide();//Does this hide the add session button
                $("#name").val(data.name); // Populate name field
                $("#price").val(data.price); // Populate price field
                $("#duration").val(data.duration); // Populate duration field
                $("#form").show(); // Show the form for editing
                $("#closeForm").show(); // Show the close button
                 
            },
            error: function() {
                alert("Failed to fetch session details. Please try again.");
            }
        });
    }

    // Close button click event to reload the page
    $("#closeForm").click(function() {
        window.location.reload();
    });

    // Initialize DataTable when the document is ready
    sessionDataTable();
});
