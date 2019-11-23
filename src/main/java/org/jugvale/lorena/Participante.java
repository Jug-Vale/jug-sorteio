package org.jugvale.lorena;

import java.util.Date;

import javax.persistence.Entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import org.jugvale.lorena.model.CheckIn;

@Entity
public class Participante extends PanacheEntity {

    public String idOriginal;
    public String nome;
    public String email;
    public Date dataSorteio;

    public static Participante fromCheckin(CheckIn checkin) {
        Participante p = new Participante();
        p.nome = checkin.name;
        p.email = checkin.email;
        p.idOriginal = checkin.id;
        p.dataSorteio = null;
        return p;
    }

}
