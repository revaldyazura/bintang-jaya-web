import "./table.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const List = ({ product, warna, tebal, berat, tinggi, detail, nomor, stok }) => {
  const { produkId } = useParams();
  //  console.log(produkId)
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (produkId) {
      const productsId = produkId.slice(0, 8);
      const colorId = produkId.slice(8, 10);
      const sizeId = produkId.slice(10, 12);
      const conesId = produkId.slice(12, 14);
      const detailsId = produkId.slice(14, 16);

      const row = {
        productsId,
        colorId,
        sizeId,
        conesId,
        detailsId,
      };

      setRows([row]);
    } else {
      const row = {
        productsId: "1100EE00",
        colorId: "01",
        sizeId: "01",
        conesId: "01",
        detailsId: "01",
      };
      setRows([row]);
    }
  }, [produkId]);
  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell className="tableCell">
                {row.productsId} (Barang)
              </TableCell>
              <TableCell className="tableCell">{row.colorId} (Warna)</TableCell>
              <TableCell className="tableCell">{row.sizeId} (Berat)</TableCell>
              <TableCell className="tableCell">
                {row.conesId} (Tinggi)
              </TableCell>
              <TableCell className="tableCell">
                {row.detailsId} (Detail)
              </TableCell>
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell className="tableCell">{product}</TableCell>
            <TableCell className="tableCell">{warna}</TableCell>
            <TableCell className="tableCell">{tebal}</TableCell>
            <TableCell className="tableCell">{tinggi}</TableCell>
            <TableCell className="tableCell">{detail}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="tableCell"></TableCell>
            <TableCell className="tableCell"></TableCell>
            <TableCell className="tableCell">{berat}</TableCell>
            <TableCell className="tableCell"></TableCell>
            <TableCell className="tableCell">{nomor}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="tableCell"></TableCell>
            <TableCell className="tableCell"></TableCell>
            <TableCell className="tableCell"></TableCell>
            <TableCell className="tableCell"></TableCell>
            <TableCell className="tableCell">{stok}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default List;
