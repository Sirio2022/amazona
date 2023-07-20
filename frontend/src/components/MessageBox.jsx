export default function MessageBox(children) {
  return (
    <div className={`alert alert-${children.variant || 'info'}`}>
      {children.children}
    </div>
  );
}
