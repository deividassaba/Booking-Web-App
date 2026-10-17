using BookingAppBack.Models;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

public class RoomReport : IDocument
{
    private readonly Room _room;

    public RoomReport(Room room)
    {
        _room= room;
    }

    public DocumentMetadata GetMetadata() => DocumentMetadata.Default;

    public DocumentSettings GetSettings() => DocumentSettings.Default;

    public void Compose(IDocumentContainer container)
    {
        container.Page(page =>
        {
            page.Size(PageSizes.A4);
            page.Margin(30);
            page.DefaultTextStyle(x => x.FontSize(9));

            page.Header()
                .Text($"Room Report: {_room.Name}")
                .FontSize(20)
                .Bold();
            page.Content()
                .PaddingVertical(15)
                .Column(column =>
                {
                    column.Item().AlignCenter()
                        .Text(text =>
                        {
                            text.Span("Generated: ");
                            text.Span(DateTime.Now.ToString("yyyy-MM-dd HH:mm"));
                        });
                    column.Item().PaddingVertical(5);
                    column.Item().Text($"Capacity: {_room.Capacity}");
                    column.Item().Text($"Equipment: {string.Join(',', _room.Equipment.Select(e=>e.Name))}");
                    column.Item().Text($"Status: {(_room.IsActive ? "Active" : "Inactive")}");
                    column.Item().PaddingVertical(5);
                    column.Item().Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn(2);
                            columns.RelativeColumn(2);
                            columns.RelativeColumn(2);
                            columns.RelativeColumn(2);
                            columns.RelativeColumn(2);
                        });

                        table.Header(header =>
                        {
                            header.Cell().Text("Title").Bold();
                            header.Cell().Text("Organizer").Bold();
                            header.Cell().Text("Start Date").Bold();
                            header.Cell().Text("End Date").Bold();
                            header.Cell().Text("Status").Bold();
                        });

                        foreach (var reservation in _room.Reservations)
                        {
                            table.Cell().Text(reservation.Title);
                            table.Cell().Text(reservation.Organizer.FullName);
                            table.Cell().Text(reservation.StartDate.ToString("yyyy-MM-dd"));
                            table.Cell().Text(reservation.EndDate.ToString("yyyy-MM-dd"));
                            table.Cell().Text(reservation.GetStatus().ToString());
                        }
                    });
                });
        });
    }
}