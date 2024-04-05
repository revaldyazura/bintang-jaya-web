import "./list.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Datatable from "../../components/datatable/Datatable";

const List = ({source, db, title, newPath, idPath}) => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <Datatable source={source} database={db} title={title} newPath={newPath} idPath={idPath}/>
      </div>
    </div>
  );
};

export default List;
