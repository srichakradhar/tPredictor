$(document).ready(function(){
    $('#results').hide();

    $("select").select2({dropdownCssClass: 'dropdown-inverse'});

    $.each($('.nav').find('li'), function() {
        $(this).toggleClass('active', $(this).find('a').attr('href') == window.location.pathname);
    });

    $('#acct_assignment_cats').html('');
    $('#order_units').html('');

    var acct_assignment_cats = [7, 8, 9, 'A', 'C', 'F', 'K', 'N', 'P','R'];
    var order_units = ['BA', 'BAG', 'BOT', 'CAS', 'D', 'DAY', 'EA', 'GH', 'HR', 'M2', 'MON', 'PAC', 'PC', 'PU', 'ROL'];
    var options = '';
    for (var i=0;i<acct_assignment_cats.length;i++){
        options += '<option value="'+ acct_assignment_cats[i] + '">' + acct_assignment_cats[i] + '</option>';
    }
    $('#acct_assignment_cats').append(options);

    options = '';
    for (var i=0;i<acct_assignment_cats.length;i++){
        options += '<option value="'+ order_units[i] + '">' + order_units[i] + '</option>';
    }
    $('#order_units').append(options);

    $('#acct_assignment_cats').val(null);
    $('#order_units').val(null);

    var initial_load = true;
    $("#model1_form").submit(function(event){
        event.preventDefault();
        var acct_ass_cat = $('#acct_assignment_cats').val();
        var order_unit = $('#order_units').val();
        if(acct_ass_cat === null || order_unit === null){
            return false;
        }

        $('#loader').removeClass('hide');

        $('#results').show();
        var data_input = [acct_ass_cat, order_unit];
        $.post('/predict/', {'data_input': JSON.stringify([acct_ass_cat, order_unit])}, function(data){
            var output_headings = Object.keys(data);

            if(initial_load){
                initial_load = false;
                output_headings_html = '';
                $.map(output_headings, function(heading){
                    output_headings_html += '<th>' + heading + '</th>';
                });
                $('#results').find('tr').append(output_headings_html);
            }

            outputs_html = '<tr><td>' + acct_ass_cat + '</td>' + '<td>' + order_unit + '</td>';
            $.map(output_headings, function(heading){
                outputs_html += '<td>' + (data[heading] * 100).toFixed(2) + "%" + '</td>';
            });
            outputs_html += '</td>';

            $('#results').append(outputs_html);
            $('#loader').addClass('hide');

        }, 'json');
    });
});
