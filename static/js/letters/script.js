// Create HTML elements
for (let i = 0; i<8; i++)
{
	$("#snowflake").append("<div class='crystal'></div>");
	for (let j = 0; j<50; j++)
	{
		$(".crystal").last().append("<div class='ice'><i></i></div>");
	}
}