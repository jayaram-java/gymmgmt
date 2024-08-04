$(document).ready(function() {
    $("#form").hide(); // Hide the form initially
    $("#closeForm").hide(); // Hide the close button initially

    $("#addMembership").click(function() {
        $("#form").toggle(); // Toggle the form visibility on button click
        $("#closeForm").hide(); // Hide the close button if it was shown for editing
        if ($("#form").is(":visible")) {
            $("#addMembership").text("Close");
        } else {
            $("#addMembership").text("Add Membership");
        }
    });

    $("#submit").click(function() {
        var id = $("#membershipId").val();
        var name = $("#name").val();
        var membershipNumber = $("#membershipNumber").val();
        var startDate = $("#startDate").val();
        var endDate = $("#endDate").val();
        var phoneNumber = $("#phoneNumber").val();

        // Validate that all fields are filled
        if (name && membershipNumber && startDate && endDate && phoneNumber) {
            var membershipDto = {
                "id": id,
                "name": name,
                "membershipNumber": membershipNumber,
                "startDate": startDate,
                "endDate": endDate,
                "phoneNumber": phoneNumber
            };

            // Determine if we are adding or updating based on the presence of id
            if (id === "") {
                $.ajax({
                    url: "/gym-mgmt/api/gymMemberships/save",
                    type: "POST",
                    dataType: 'json',
                    contentType: "application/json",
                    data: JSON.stringify(membershipDto),
                    success: function(data) {
                        if (data === true) {
                            $("#successMessage").show(); // Show success message
                            setTimeout(function() {
                                $("#successMessage").hide();
                                window.location.reload(); // Reload page after successful submission
                            }, 2000); // Hide message after 2 seconds
                        } else {
                            alert("The membership could not be added."); // Show alert if data is not true
                        }
                    },
                    error: function() {
                        alert("An error occurred while saving the membership."); // Show error if AJAX request fails
                    }
                });
            } else {
                $.ajax({
                    url: "/gym-mgmt/api/gymMemberships/update",
                    type: "POST",
                    dataType: 'json',
                    contentType: "application/json",
                    data: JSON.stringify(membershipDto),
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
                                text: "Membership not updated.",
                                type: "warning",
                            });
                        }
                    },
                    error: function() {
                        alert("An error occurred while updating the membership details.");
                    }
                });
            }
        } else {
            alert("Please enter all fields."); // Show alert if any required field is empty
        }
    });
    
     function membershipDataTable() {
        $('#membershipTable').DataTable({
            "ajax": {
                "url": "/gym-mgmt/api/gymMemberships/getAllDetails",
                "type": 'GET',
                "datatype": "json",
                "dataSrc": ""
            },
            "columns": [
                { "data": "id", "visible": false }, // Hide ID column
                { "data": "name" },
                { "data": "membershipNumber" },
                { "data": "startDate" },
                { "data": "endDate" },
                { "data": "phoneNumber" }
            ]
        });
    }

    // Function to initialize DataTable for membership data
    function membershipDataTableForAdmin() {
        $('#membershipTableForAdmin').DataTable({
            "ajax": {
                "url": "/gym-mgmt/api/gymMemberships/getAllDetails",
                "type": 'GET',
                "datatype": "json",
                "dataSrc": ""
            },
            "columns": [
                { "data": "id", "visible": false }, // Hide ID column
                { "data": "name" },
                { "data": "membershipNumber" },
                { "data": "startDate" },
                { "data": "endDate" },
                { "data": "phoneNumber" },
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
        $("#membershipId").val(id); // Set membership ID in a hidden input field

        // AJAX request to get membership details
        $.ajax({
            url: "/gym-mgmt/api/gymMemberships/getById",
            type: "GET",
            data: {
                'id': id,
            },
            success: function(data) {
                $("#addMembership").hide();// Hide the add membership button
                $("#name").val(data.name); // Populate name field
                $("#membershipNumber").val(data.membershipNumber); // Populate membership number field
                $("#startDate").val(data.startDate); // Populate start date field
                $("#endDate").val(data.endDate); // Populate end date field
                $("#phoneNumber").val(data.phoneNumber); // Populate phone number field
                $("#form").show(); // Show the form for editing
                $("#closeForm").show(); // Show the close button
            },
            error: function() {
                alert("Failed to fetch membership details. Please try again.");
            }
        });
    }

    // Close button click event to reload the page
    $("#closeForm").click(function() {
        window.location.reload();
    });

    // Initialize DataTable when the document is ready
    membershipDataTable();
    
    membershipDataTableForAdmin();
});