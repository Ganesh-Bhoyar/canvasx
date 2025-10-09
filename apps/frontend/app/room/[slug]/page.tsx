import Board from "../../../components/board";

type Props = {
  params: {
    slug: string;  
  };
};

export default  async function CanvasPage({ params }: Props) {
  const slug =  (await params).slug;
  

  return (
    <div className="overflow-hidden overflow-y-hidden">
      {slug}
    
      <Board slug={slug} />
    </div>
  );
}
