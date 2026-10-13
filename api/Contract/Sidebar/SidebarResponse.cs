namespace api.Contract.Sidebar;

public sealed record SidebarResponse(
    string Role,
    IReadOnlyList<SidebarGroupResponse> Groups);

public sealed record SidebarGroupResponse(
    string Label,
    IReadOnlyList<SidebarItemResponse> Items);

public sealed record SidebarItemResponse(
    string Slug,
    string Label,
    string Description,
    string Icon,
    string Href);
