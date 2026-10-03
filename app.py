from __future__ import annotations

import os
import re
from datetime import datetime
from pathlib import Path

from flask import Flask, render_template, request, redirect, url_for, send_from_directory
from sqlalchemy import DateTime, ForeignKey, Integer, String, create_engine, func, select
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column


class Base(DeclarativeBase):
    pass


class Region(Base):
    __tablename__ = "region"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(200), nullable=False)


class Comuna(Base):
    __tablename__ = "comuna"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(200), nullable=False)
    region_id: Mapped[int] = mapped_column(ForeignKey("region.id"), nullable=False)


class Voluntario(Base):
    __tablename__ = "voluntario"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(80), nullable=False)
    telefono: Mapped[str] = mapped_column(String(15), nullable=False)
    fecha_registro: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    comuna_id: Mapped[int] = mapped_column(ForeignKey("comuna.id"), nullable=False)


class Ave(Base):
    __tablename__ = "ave"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(80), nullable=False)


class Avistamiento(Base):
    __tablename__ = "avistamiento"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    voluntario_id: Mapped[int] = mapped_column(ForeignKey("voluntario.id"), nullable=False)
    ave_id: Mapped[int] = mapped_column(ForeignKey("ave.id"), nullable=False)
    fecha_hora: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    lugar: Mapped[str] = mapped_column(String(200), nullable=False)
    descripcion: Mapped[str | None] = mapped_column(String(500), nullable=True)


class Registro(Base):
    __tablename__ = "registro"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    ruta_archivo: Mapped[str] = mapped_column(String(300), nullable=False)
    nombre_archivo: Mapped[str] = mapped_column(String(300), nullable=False)
    avistamiento_id: Mapped[int] = mapped_column(ForeignKey("avistamiento.id"), nullable=False)


app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+mysqlconnector://cc5002:programacionweb@localhost:3306/tarea2?charset=utf8mb4"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["UPLOAD_FOLDER"] = os.path.join(os.path.dirname(__file__), "uploads")

engine = create_engine(app.config["SQLALCHEMY_DATABASE_URI"])

os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)


def obtener_voluntarios():
    with Session(engine) as session:
        return session.execute(select(Voluntario).order_by(Voluntario.nombre)).scalars().all()


def obtener_aves():
    with Session(engine) as session:
        return session.execute(select(Ave).order_by(Ave.nombre)).scalars().all()


def obtener_regiones():
    with Session(engine) as session:
        return session.execute(select(Region).order_by(Region.nombre)).scalars().all()


def obtener_comunas_por_region():
    with Session(engine) as session:
        rows = session.execute(
            select(Comuna.id, Comuna.nombre, Comuna.region_id)
            .order_by(Comuna.region_id, Comuna.nombre)
        ).all()

    comunas_por_region = {}
    for comuna_id, nombre, region_id in rows:
        comunas_por_region.setdefault(str(region_id), []).append({
            "id": str(comuna_id),
            "nombre": nombre,
        })
    return comunas_por_region


def validar_voluntario(form_data):
    errors = {}
    nombre = (form_data.get("nombre") or "").strip()
    apellidos = (form_data.get("apellidos") or "").strip()
    documento = (form_data.get("documento") or "").strip()
    email = (form_data.get("email") or "").strip()
    telefono = (form_data.get("telefono") or "").strip()
    region_id = (form_data.get("region") or "").strip()
    comuna_id = (form_data.get("comuna") or "").strip()
    direccion = (form_data.get("direccion") or "").strip()

    if not nombre:
        errors["nombre"] = "El nombre es obligatorio."
    elif len(nombre) > 60:
        errors["nombre"] = "El nombre no puede exceder los 60 caracteres."

    if not apellidos:
        errors["apellidos"] = "Los apellidos son obligatorios."
    elif len(apellidos) > 80:
        errors["apellidos"] = "Los apellidos no pueden exceder los 80 caracteres."

    if not documento:
        errors["documento"] = "El RUN o documento de identidad es obligatorio."
    elif not re.fullmatch(r"^\d{1,2}\.\d{3}\.\d{3}-[0-9kK]$", documento):
        errors["documento"] = "El RUN debe tener el formato 12.345.678-9."

    if not email:
        errors["email"] = "El correo electrónico es obligatorio."
    elif not re.fullmatch(r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$", email):
        errors["email"] = "El correo electrónico no tiene un formato válido."

    if not telefono:
        errors["telefono"] = "El teléfono es obligatorio."
    elif not re.fullmatch(r"^(?:\+56\s?)?(?:9\s?\d{8})$", telefono):
        errors["telefono"] = "El teléfono debe tener formato chileno, por ejemplo +56 9 1234 5678."

    if not region_id:
        errors["region"] = "Debe seleccionar una región."
    if not comuna_id:
        errors["comuna"] = "Debe seleccionar una comuna."
    if direccion and len(direccion) > 200:
        errors["direccion"] = "La dirección no puede exceder los 200 caracteres."

    if region_id and comuna_id:
        with Session(engine) as session:
            comuna = session.get(Comuna, int(comuna_id))
            if not comuna or str(comuna.region_id) != region_id:
                errors["comuna"] = "La comuna seleccionada no corresponde a la región elegida."

    return errors


def validar_avistamiento(form_data, files):
    errors = {}

    voluntario_id = (form_data.get("voluntario") or "").strip()
    tipo_ave = (form_data.get("tipoAve") or "").strip()
    nombre_ave = (form_data.get("nombreAve") or "").strip()
    fecha = (form_data.get("fechaAvistamiento") or "").strip()
    hora = (form_data.get("horaAvistamiento") or "").strip()
    region_id = (form_data.get("regionObservacion") or "").strip()
    comuna_id = (form_data.get("comunaObservacion") or "").strip()
    lugar = (form_data.get("lugar") or "").strip()
    descripcion = (form_data.get("descripcion") or "").strip()
    archivos = files.getlist("archivo") if files else []

    if not voluntario_id:
        errors["voluntario"] = "Debe seleccionar el voluntario responsable del avistamiento."
    elif not re.fullmatch(r"\d+", voluntario_id):
        errors["voluntario"] = "Identificador de voluntario inválido."

    if not tipo_ave:
        errors["tipoAve"] = "Debe seleccionar el tipo de ave."

    if not nombre_ave:
        errors["nombreAve"] = "Debe indicar el nombre del ave."
    elif len(nombre_ave) > 80:
        errors["nombreAve"] = "El nombre del ave no puede exceder 80 caracteres."

    if not fecha:
        errors["fechaAvistamiento"] = "La fecha del avistamiento es obligatoria."
    else:
        try:
            fecha_obj = datetime.strptime(fecha, "%Y-%m-%d")
            if fecha_obj > datetime.now():
                errors["fechaAvistamiento"] = "La fecha no puede estar en el futuro."
        except ValueError:
            errors["fechaAvistamiento"] = "La fecha debe tener formato válido."

    if not hora:
        errors["horaAvistamiento"] = "La hora del avistamiento es obligatoria."

    if not region_id:
        errors["regionObservacion"] = "Debe seleccionar una región."
    if not comuna_id:
        errors["comunaObservacion"] = "Debe seleccionar una comuna."

    if not lugar:
        errors["lugar"] = "El lugar del avistamiento es obligatorio."
    elif len(lugar) > 200:
        errors["lugar"] = "El lugar no puede exceder 200 caracteres."

    if descripcion and len(descripcion) > 500:
        errors["descripcion"] = "La descripción no puede exceder 500 caracteres."

    if not archivos or len(archivos) == 0:
        errors["archivo"] = "Debe adjuntar al menos un archivo de foto o video."
    else:
        for archivo in archivos:
            if archivo.filename == "":
                errors["archivo"] = "Hay un archivo sin nombre; no se puede registrar."
                break
            if not archivo.mimetype or not archivo.mimetype.startswith(("image/", "video/")):
                errors["archivo"] = "Solo se permiten archivos de imagen o video."
                break

    if region_id and comuna_id:
        with Session(engine) as session:
            comuna = session.get(Comuna, int(comuna_id))
            if not comuna or str(comuna.region_id) != region_id:
                errors["comunaObservacion"] = "La comuna seleccionada no corresponde a la región elegida."

    return errors


@app.route("/")
def index():
    with Session(engine) as session:
        stmt = (
            select(
                Avistamiento.id,
                Avistamiento.fecha_hora,
                Avistamiento.lugar,
                Ave.nombre.label("ave_nombre"),
                Voluntario.nombre.label("voluntario_nombre"),
            )
            .join(Ave, Ave.id == Avistamiento.ave_id)
            .join(Voluntario, Voluntario.id == Avistamiento.voluntario_id)
            .order_by(Avistamiento.fecha_hora.desc())
            .limit(2)
        )
        ultimos_avistamientos = session.execute(stmt).all()

    return render_template("index.html", ultimos_avistamientos=ultimos_avistamientos)


@app.route("/registrar_voluntario", methods=["GET", "POST"])
def registrar_voluntario():
    form_data = request.form.to_dict(flat=True) if request.method == "POST" else {}
    regions = obtener_regiones()
    comunas_por_region = obtener_comunas_por_region()

    if request.method == "POST":
        errors = validar_voluntario(form_data)
        if errors:
            return render_template(
                "registrar_voluntario.html",
                regions=regions,
                comunas_por_region=comunas_por_region,
                form_data=form_data,
                errors=errors,
            )

        nombre_completo = f"{form_data.get('nombre', '').strip()} {form_data.get('apellidos', '').strip()}".strip()
        comuna_id = int(form_data["comuna"])

        with Session(engine) as session:
            voluntario = Voluntario(
                nombre=nombre_completo,
                email=(form_data.get("email") or "").strip(),
                telefono=(form_data.get("telefono") or "").strip(),
                fecha_registro=datetime.now(),
                comuna_id=comuna_id,
            )
            session.add(voluntario)
            session.commit()
            voluntario_id = voluntario.id

        return render_template(
            "registrar_voluntario.html",
            regions=regions,
            comunas_por_region=comunas_por_region,
            success_message="Voluntario registrado correctamente.",
            volunteer_id=voluntario_id,
        )

    return render_template(
        "registrar_voluntario.html",
        regions=regions,
        comunas_por_region=comunas_por_region,
        form_data={},
        errors={},
    )


@app.route("/informar_avistamiento", methods=["GET", "POST"])
def informar_avistamiento():
    form_data = request.form.to_dict(flat=True) if request.method == "POST" else {}
    regions = obtener_regiones()
    comunas_por_region = obtener_comunas_por_region()
    voluntarios = obtener_voluntarios()
    aves = obtener_aves()

    if request.method == "POST":
        errors = validar_avistamiento(form_data, request.files)

        if errors:
            return render_template(
                "informar_avistamiento.html",
                regions=regions,
                comunas_por_region=comunas_por_region,
                voluntarios=voluntarios,
                aves=aves,
                form_data=form_data,
                errors=errors,
            )

        voluntario_id = int(form_data["voluntario"])
        tipo_ave = (form_data.get("tipoAve") or "").strip()
        nombre_ave = (form_data.get("nombreAve") or "").strip()
        descripcion = (form_data.get("descripcion") or "").strip() or None
        fecha_hora = datetime.strptime(f"{form_data['fechaAvistamiento']} {form_data['horaAvistamiento']}", "%Y-%m-%d %H:%M")

        with Session(engine) as session:
            ave = session.execute(select(Ave).where(Ave.nombre == nombre_ave)).scalar_one_or_none()
            if ave is None:
                ave = Ave(nombre=nombre_ave)
                session.add(ave)
                session.flush()

            avistamiento = Avistamiento(
                voluntario_id=voluntario_id,
                ave_id=ave.id,
                fecha_hora=fecha_hora,
                lugar=(form_data.get("lugar") or "").strip(),
                descripcion=descripcion,
            )
            session.add(avistamiento)
            session.flush()

            uploads = request.files.getlist("archivo")
            for archivo in uploads:
                if archivo.filename == "":
                    continue

                nombre_archivo = Path(archivo.filename).name
                nombre_seguro = f"{datetime.now().strftime('%Y%m%d%H%M%S%f')}_{nombre_archivo}"
                ruta = os.path.join(app.config["UPLOAD_FOLDER"], nombre_seguro)
                archivo.save(ruta)

                registro = Registro(
                    ruta_archivo=ruta,
                    nombre_archivo=nombre_seguro,
                    avistamiento_id=avistamiento.id,
                )
                session.add(registro)

            session.commit()

        return redirect(url_for("index", mensaje="Avistamiento registrado correctamente."))

    if request.args.get("voluntario_id"):
        form_data["voluntario"] = request.args.get("voluntario_id")

    return render_template(
        "informar_avistamiento.html",
        regions=regions,
        comunas_por_region=comunas_por_region,
        voluntarios=voluntarios,
        aves=aves,
        form_data=form_data,
        errors={},
    )


@app.route("/estadisticas")
def estadisticas():
    return render_template("estadisticas.html")


@app.route("/listar_avistamientos")
def listar_avistamientos():
    page = max(1, int(request.args.get("page", 1)))
    per_page = 10
    resultados, total = obtener_listado_avistamientos(page=page, per_page=per_page)
    total_pages = max(1, (total + per_page - 1) // per_page) if total else 1

    return render_template(
        "listar_avistamientos.html",
        avistamientos=resultados,
        page=page,
        total_pages=total_pages,
        total=total,
    )


@app.route("/detalle_avistamiento/<int:avistamiento_id>")
def detalle_avistamiento(avistamiento_id):
    detalle = obtener_detalle_avistamiento(avistamiento_id)
    if detalle is None:
        return redirect(url_for("listar_avistamientos"))

    return render_template("detalle_avistamiento.html", detalle=detalle)


@app.route("/uploads/<path:filename>")
def uploaded_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)


def obtener_listado_avistamientos(page=1, per_page=10):
    with Session(engine) as session:
        stmt = (
            select(Avistamiento, Ave.nombre.label("ave_nombre"), Voluntario.nombre.label("voluntario_nombre"))
            .join(Ave, Ave.id == Avistamiento.ave_id)
            .join(Voluntario, Voluntario.id == Avistamiento.voluntario_id)
            .order_by(Avistamiento.fecha_hora.desc())
        )

        total = session.execute(
            select(func.count()).select_from(Avistamiento).join(Ave, Ave.id == Avistamiento.ave_id).join(Voluntario, Voluntario.id == Avistamiento.voluntario_id)
        ).scalar_one()

        results = session.execute(stmt.limit(per_page).offset((page - 1) * per_page)).all()

    return results, total


def obtener_detalle_avistamiento(avistamiento_id):
    with Session(engine) as session:
        avistamiento = session.get(Avistamiento, avistamiento_id)
        if avistamiento is None:
            return None

        ave = session.get(Ave, avistamiento.ave_id)
        voluntario = session.get(Voluntario, avistamiento.voluntario_id)
        archivos = session.execute(
            select(Registro).where(Registro.avistamiento_id == avistamiento_id)
        ).scalars().all()

    return {
        "avistamiento": avistamiento,
        "ave": ave,
        "voluntario": voluntario,
        "archivos": archivos,
    }


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
