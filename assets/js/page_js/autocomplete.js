$(document).ready(function() { 
		var cache = {};

		$( "#page_name_search_input" ).autocomplete({
			minLength: 1,
			source: function( request, response ) {
				var term = request.term;
				if ( term in cache ) {
					response( cache[ term ] );
					return;
				}
				$.ajax({
					url:'page_name_search',					
					cache: false,
					type: 'post',
					dataType: "json",
					data:request,
					success:  function( data, status, xhr ) {
						cache[ term ] = data;
						response( data );
					},
		            error: function(data, status, e){
		                //alert("ajax error:"+ e);
		            }
				});
			},
			select:function( event, ui ) {
				// $("select#page_select").val(ui.item.value);
				$("select#page_select option").filter(function() {
				    return $(this).text() == ui.item.value; 
				}).prop('selected', true).change();
			}
		});
});
