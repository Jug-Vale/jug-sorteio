package org.jugvale.lorena;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;
import org.jugvale.lorena.model.CheckIn;

@Path("api/v1")
@RegisterRestClient(baseUri = "http://jugvale-checkin-api.herokuapp.com/")
public interface CheckInService {

    @GET
    @Path("credentials")
    @Produces("application/json")
    public List<CheckIn> lista();

}
