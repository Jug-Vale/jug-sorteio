package org.jugvale.lorena;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;

import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.jugvale.lorena.model.CheckIn;

@Path("/participantes")
@RolesAllowed({"ADMINISTRADOR"})
@Produces(MediaType.APPLICATION_JSON)
public class ParticipanteResource {

    @Inject
    @RestClient
    private CheckInService checkInService;

    @POST
    @Transactional
    @Path("carrega")
    public List<Participante> carregaParticipantes() {
        Participante.deleteAll();
        List<CheckIn> lista = checkInService.lista();
        return lista.stream()
                    .map(checkIn -> Participante.fromCheckin(checkIn))
                    .peek(p -> p.persist())
                    .collect(Collectors.toList());
    }

    @POST
    @Transactional
    @Path("atualiza")
    public List<Participante> carregaNovosParticipantes() {
        System.out.println("NOVOSS!");
        checkInService.lista().stream()
                      .filter(checkIn -> Participante.find("idOriginal", checkIn.id).list().isEmpty())
                      .peek(c -> System.out.println(c.name))
                      .map(Participante::fromCheckin)
                      .forEach(p -> p.persist());
        return Participante.listAll();

    }

    @GET
    public List<Participante> participantes() {
        return Participante.listAll();
    }

    @POST
    @Transactional
    @Path("{id}/sorteia")
    public List<Participante> confirma(@PathParam("id") long id) {
        Participante participante = Participante.findById(id);
        if (participante == null) {
            throw new WebApplicationException(404);
        }
        participante.dataSorteio = new Date();
        participante.persist();
        return Participante.listAll();
    }
}
