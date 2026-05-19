function DocStatusBadge({ status }: { status: boolean }) {
  if (status)
    return (
      <span className="text-xs font-semibold text-green-600 bg-green-50 border border-green-200 rounded px-2 py-0.5">
        VERIFIED
      </span>
    );
  return (
    <span className="text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 rounded px-2 py-0.5">
      UPDATE
    </span>
  );
}

export default DocStatusBadge;
